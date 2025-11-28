// 临时调试入口文件
import { hideBin } from 'yargs/helpers';
import { main } from '/Users/vincentlli/Documents/demo/ali-cli/ef-dev-tools/packages/tef-cli/src/index';

main(hideBin(process.argv)).catch(() => {});
