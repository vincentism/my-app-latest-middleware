太好了！让我详细梳理这个问题的根本原因和解决过程。

## 问题根因分析：EdgeOne 运行时中 Next.js Middleware 的 `nextUrl` 属性丢失

### 1. 问题现象
Next.js Middleware 在 EdgeOne 边缘函数中运行时，报错：
```
Cannot read properties of undefined (reading 'pathname')
```
错误发生在访问 `request.nextUrl.pathname` 时。

---

### 2. Next.js 源码结构

Next.js 的 `NextRequest` 类继承链：
```
Request (Web API 原生类)
    └── M 类 (NextRequest 基类)
            └── a7 类 (实际使用的 NextRequest)
```

**M 类（NextRequest 基类）的关键代码：**
```javascript
let L = Symbol("internal request");  // 使用 Symbol 作为私有属性键

class M extends Request {
  constructor(a, b = {}) {
    super(a, b);
    // 创建 NextURL 对象
    let d = new J(c, { headers: s(this.headers), nextConfig: b.nextConfig });
    // 将 nextUrl 存储在 Symbol 属性中
    this[L] = {
      cookies: new K.RequestCookies(this.headers),
      nextUrl: d,
      url: d.toString()
    };
  }
  
  // 通过 getter 访问 nextUrl
  get nextUrl() {
    return this[L].nextUrl;
  }
}
```

**a7 类（实际 NextRequest）：**
```javascript
class a7 extends M {
  constructor(a) {
    super(a.input, a.init);  // 调用父类构造函数
    this.sourcePage = a.page;
  }
}
```

---

### 3. 问题根因：EdgeOne 运行时的特殊行为

#### 3.1 第一个问题：Symbol 属性在继承链中丢失

**现象：**
```
[M constructor] this[L] set, nextUrl exists: "true"  // 父类中设置成功
[a7 constructor] Object.getOwnPropertyNames(this): ["maxFollow","version","eo","cf","url",...] // 没有 Symbol 属性！
[a7 constructor] this.nextUrl: "undefined"  // 访问失败
```

**原因：**
EdgeOne 运行时的 `Request` 类实现与标准浏览器/Node.js 不同。当 `a7` 类继承 `M` 类（继承自 `Request`）时：
- `M` 类构造函数中通过 `this[L] = {...}` 设置的 Symbol 属性
- 在 `a7` 子类实例上**无法被访问到**

这可能是因为 EdgeOne 的 `Request` 类在构造时会重新初始化实例属性，覆盖或丢失了通过 Symbol 设置的属性。

#### 3.2 第一次修复尝试：将 Symbol 改为字符串属性

```javascript
// 修改前
let L = Symbol("internal request");

// 修改后
let L = "__nextInternal";
```

**结果：**
```
[a7 constructor] Object.getOwnPropertyNames(this): [..., "__nextInternal"]  // 属性存在了！
[a7 constructor] this.__nextInternal: "{\"hasNextUrl\":true}"  // 内容正确
[a7 constructor] this.nextUrl: "undefined"  // 但 getter 仍然返回 undefined！
```

属性存在了，但 `get nextUrl()` getter 仍然返回 `undefined`。

---

#### 3.3 第二个问题：类的 getter 在继承链中不生效

**现象：**
即使在 `a7` 类中显式定义了 `get nextUrl()` getter：
```javascript
class a7 extends M {
  get nextUrl() {
    return this.__nextInternal ? this.__nextInternal.nextUrl : undefined;
  }
  constructor(a) { ... }
}
```

访问 `this.nextUrl` 仍然返回 `undefined`。

**原因：**
EdgeOne 运行时的 `Request` 类可能：
1. 在原型链上定义了 `nextUrl` 属性（值为 `undefined`）
2. 或者使用了某种机制阻止子类覆盖某些属性
3. 导致类定义中的 getter 被遮蔽或不生效

---

### 4. 最终解决方案：在构造函数中使用 `Object.defineProperty`

```javascript
class a7 extends M {
  constructor(a) {
    super(a.input, a.init);
    
    // 在实例上直接定义 nextUrl getter
    Object.defineProperty(this, "nextUrl", {
      get: function() {
        return this.__nextInternal ? this.__nextInternal.nextUrl : undefined;
      },
      enumerable: true,
      configurable: true
    });
    
    this.sourcePage = a.page;
  }
}
```

**为什么这个方案有效：**
1. `Object.defineProperty` 直接在**实例对象**上定义属性，而不是在原型链上
2. 这会覆盖原型链上任何同名属性
3. 在构造函数中调用，确保在对象创建时就定义好属性
4. `configurable: true` 允许属性被重新定义

---

### 5. 完整修复步骤总结

| 步骤 | 修改内容 | 解决的问题 |
|------|----------|------------|
| 1 | `Symbol("internal request")` → `"__nextInternal"` | Symbol 属性在 EdgeOne 继承链中丢失 |
| 2 | 在 `a7` 构造函数中使用 `Object.defineProperty` 定义 `nextUrl` getter | 类定义中的 getter 在 EdgeOne 运行时不生效 |

---

### 6. 技术总结

**EdgeOne 运行时与标准 JavaScript 运行时的差异：**

| 特性 | 标准运行时 | EdgeOne 运行时 |
|------|-----------|----------------|
| Symbol 属性继承 | ✅ 正常继承 | ❌ 可能丢失 |
| 类 getter 继承 | ✅ 正常继承 | ❌ 可能被遮蔽 |
| `Object.defineProperty` | ✅ 正常工作 | ✅ 正常工作 |

**最佳实践建议：**
在 EdgeOne 边缘函数中使用继承自 `Request`/`Response` 等 Web API 类时：
1. 避免使用 Symbol 作为属性键
2. 避免依赖类定义中的 getter/setter 继承
3. 使用 `Object.defineProperty` 在构造函数中直接定义实例属性