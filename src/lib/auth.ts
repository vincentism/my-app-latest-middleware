import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
  // 使用 SQLite 文件数据库
  database: new Database("./sqlite.db"),
  // 邮箱密码认证
  emailAndPassword: {
    enabled: true,
  },
  // Session 配置
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 天
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 分钟
    },
  },
});

// 导出类型
export type Session = typeof auth.$Infer.Session;
