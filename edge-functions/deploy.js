/**
 * EdgeOne Functions 部署脚本
 * 构建项目并准备部署文件
 */

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 递归复制目录
 */
async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else if (entry.isFile() && !entry.name.includes('test-')) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

/**
 * 创建部署目录结构
 */
async function prepareDeployDirectory() {
  console.log('📁 准备部署目录...');
  
  const deployDir = join(__dirname, 'dist');
  const functionsDir = join(deployDir, 'functions');
  
  try {
    // 创建目录
    await fs.mkdir(functionsDir, { recursive: true });
    
    // 复制当前目录下的文件到部署目录
    const currentDir = __dirname;
    
    // 只复制必要的目录和文件，避免递归复制dist目录
    const dirsToCopy = ['api', 'lib'];
    const filesToCopy = ['proxy-origin.js'];
    
    // 复制目录
    for (const dir of dirsToCopy) {
      const srcDir = join(currentDir, dir);
      const destDir = join(functionsDir, dir);
      
      try {
        await copyDirectory(srcDir, destDir);
      } catch (error) {
        console.log(`跳过目录: ${dir}`);
      }
    }
    
    // 复制文件
    for (const file of filesToCopy) {
      const srcPath = join(currentDir, file);
      const destPath = join(functionsDir, file);
      
      try {
        await fs.copyFile(srcPath, destPath);
      } catch (error) {
        console.log(`跳过文件: ${file}`);
      }
    }
    
    // 创建部署配置文件
    const deployConfig = {
      "functions": {
        "include": ["functions/**/*.js"],
        "exclude": ["functions/deploy.js"]
      },
      "routes": [
        { "src": "/api/(.*)", "dest": "/functions/api/$1" },
        { "src": "/(.*)", "dest": "/functions/$1" }
      ]
    };
    
    await fs.writeFile(
      join(deployDir, 'edgeone.json'),
      JSON.stringify(deployConfig, null, 2)
    );
    
    console.log('✅ 部署目录准备完成');
    console.log(`📂 路径: ${deployDir}`);
    
  } catch (error) {
    console.error('❌ 准备部署目录失败:', error);
    throw error;
  }
}

/**
 * 验证部署文件
 */
async function validateDeployFiles() {
  console.log('🔍 验证部署文件...');
  
  const deployDir = join(__dirname, 'dist');
  const functionsDir = join(deployDir, 'functions');
  
  try {
    // 检查关键文件是否存在
    const requiredFiles = [
      'lib/auth-simple.js',
      'lib/middleware.js',
      'lib/utils.js',
      'lib/fallback.js',
      'api/proxy/auth.js',
      'api/subscription/status.js',
      'api/payment/create-checkout.js',
      'api/system/status.js',
      'api/env.js'
    ];
    
    let missingFiles = [];
    
    for (const file of requiredFiles) {
      const filePath = join(functionsDir, file);
      try {
        await fs.access(filePath);
      } catch {
        missingFiles.push(file);
      }
    }
    
    if (missingFiles.length > 0) {
      console.warn('⚠️  缺少文件:', missingFiles);
    } else {
      console.log('✅ 所有必需文件都存在');
    }
    
    // 检查文件内容
    const middlewarePath = join(functionsDir, 'lib/middleware.js');
    const middlewareContent = await fs.readFile(middlewarePath, 'utf8');
    
    if (middlewareContent.includes('verifyTokenSimple')) {
      console.log('✅ 认证中间件已更新为简化版');
    } else {
      console.warn('⚠️  认证中间件可能未更新');
    }
    
    if (middlewareContent.includes('requireAuthWithFallback')) {
      console.log('✅ 降级认证中间件已配置');
    } else {
      console.warn('⚠️  降级认证中间件可能未配置');
    }
    
  } catch (error) {
    console.error('❌ 验证部署文件失败:', error);
    throw error;
  }
}

/**
 * 生成部署报告
 */
async function generateDeployReport() {
  console.log('📊 生成部署报告...');
  
  const report = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    fixes: [
      '简化JWT验证实现（auth-simple.js）',
      '认证中间件添加详细日志',
      '认证中间件支持降级模式',
      '代理认证端点使用降级模式',
      '订阅状态端点使用降级模式',
      '支付创建结账端点使用降级模式'
    ],
    deployment: {
      target: 'EdgeOne Functions',
      framework: 'Edge Functions',
      runtime: 'JavaScript'
    },
    recommendations: [
      '在EdgeOne Functions控制台检查运行时日志',
      '验证JWT_SECRET环境变量已正确配置',
      '测试降级模式是否正常工作',
      '监控认证端点的错误率'
    ]
  };
  
  const reportPath = join(__dirname, 'deploy-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  console.log('✅ 部署报告已生成:', reportPath);
  return report;
}

/**
 * 主部署流程
 */
async function main() {
  console.log('🚀 EdgeOne Functions 部署流程开始');
  console.log('='.repeat(50));
  
  try {
    // 1. 准备部署目录
    await prepareDeployDirectory();
    
    // 2. 验证部署文件
    await validateDeployFiles();
    
    // 3. 生成部署报告
    const report = await generateDeployReport();
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 部署准备完成！');
    console.log('='.repeat(50));
    
    console.log('\n📋 下一步操作:');
    console.log('1. 将 dist/ 目录上传到 EdgeOne Functions');
    console.log('2. 在 EdgeOne Functions 控制台配置环境变量');
    console.log('3. 运行测试验证修复效果');
    console.log('4. 监控运行时日志');
    
    console.log('\n🔧 修复内容:');
    report.fixes.forEach((fix, index) => {
      console.log(`${index + 1}. ${fix}`);
    });
    
  } catch (error) {
    console.error('❌ 部署流程失败:', error);
    process.exit(1);
  }
}

// 运行部署流程
main().catch(console.error);