import Bubble from './Bubble';
import List from './BubbleList';
import Divider from './Divider';
import System from './System';

export type {
  BubbleContentType,
  BubbleItemType,
  BubbleListProps,
  BubbleListRef,
  BubbleProps,
  BubbleRef,
  DividerRoleProps,
  FuncDividerRoleProps,
  FuncRoleProps,
  RoleProps,
  RoleType,
} from './interface';

type BubbleType = typeof Bubble & {
  List: typeof List;
  System: typeof System;
  Divider: typeof Divider;
};

(Bubble as BubbleType).List = List;
(Bubble as BubbleType).System = System;
(Bubble as BubbleType).Divider = Divider;

export default Bubble as BubbleType;
