import type { GetProp, GetRef } from 'antd';
import React, { useRef } from 'react';
import Bubble from '..';
import type {
  BubbleContentType,
  BubbleItemType,
  BubbleListProps,
  BubbleListRef,
  DividerRoleProps,
  FuncDividerRoleProps,
  FuncRoleProps,
  RoleProps,
  RoleType,
} from '../interface';

type Row = { query: string };

// ============================ 1. 泛型 items ============================
const mixedItems: BubbleItemType<Row | string>[] = [
  { key: 'user', role: 'user', content: 'hello' },
  { key: 'ai', role: 'ai', content: { query: 'hello' } },
  { key: 'divider', role: 'divider', content: 'divider' },
];

const renderMixedList = () => (
  <Bubble.List
    role={{
      ai: (data) => ({
        contentRender: () => {
          const content = data.content;
          return <span>{typeof content === 'string' ? content : content.query}</span>;
        },
      }),
    }}
    items={mixedItems}
  />
);

// ============================ 2. 无参写法 ============================
const plainItem: BubbleItemType = { key: 1, role: 'user', content: 'hello' };
const plainRole: RoleType = {};
const plainItems: BubbleListProps['items'] = [plainItem];
const plainListRole: BubbleListProps['role'] = plainRole;

const renderPlainList = () => <Bubble.List items={plainItems} role={plainListRole} />;

// ============================ 3. GetProp / GetRef ============================
const listRole: GetProp<typeof Bubble.List, 'role'> = {
  ai: {
    contentRender: (content: { query: string }) => <span>{content.query}</span>,
  },
};

const TypedList = () => {
  const listRef = useRef<GetRef<typeof Bubble.List>>(null);
  return (
    <Bubble.List ref={listRef} role={listRole} items={[{ key: 'ai', role: 'ai', content: {} }]} />
  );
};

// ============================ 4. 空数组 ============================
const renderEmptyList = () => <Bubble.List items={[]} />;

// ============================ 5. 负向用例 ============================
// @ts-expect-error content 与 BubbleItemType<Row> 不兼容
const wrongItem: BubbleItemType<Row> = { key: 'wrong', role: 'ai', content: 'plain string' };

const wrongRole: RoleType<Row> = {
  // @ts-expect-error contentRender 参数类型与 RoleType<Row> 不兼容
  ai: { contentRender: (content: number) => <span>{content}</span> },
};

it('type', () => {});

export type {
  BubbleContentType,
  BubbleListRef,
  DividerRoleProps,
  FuncDividerRoleProps,
  FuncRoleProps,
  RoleProps,
};
export { renderEmptyList, renderMixedList, renderPlainList, TypedList, wrongItem, wrongRole };
