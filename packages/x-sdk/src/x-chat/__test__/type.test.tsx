import type { XChatConfig } from '../..';
import type { MessageInfo, SimpleType } from '..';

type Row = { query: string };
type BubbleRow = { text: string };
type MyExtra = { traceId: string };

// 单参用法保持可用
const single: MessageInfo<Row> = {
  id: 1,
  message: { query: 'hello' },
  status: 'local',
  extraInfo: { any: 1 },
};

// 自定义 extraInfo
const withExtra: MessageInfo<Row, MyExtra> = {
  id: 'msg_1',
  message: { query: 'hello' },
  status: 'success',
  extraInfo: { traceId: 'trace-1' },
};

// 包根导出的 XChatConfig
const config: XChatConfig<Row, BubbleRow> = {
  parser: (message) => ({ text: message.query }),
};

it('type', () => {});

export type { SimpleType };
export { config, single, withExtra };
