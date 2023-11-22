import { EventBusKey } from "@vueuse/core";
//递归组件传递事件有问题，故使用eventbus
export const onCreateEventBusKey: EventBusKey<string | undefined> = Symbol(
  "organizationUnit.create"
);

export const onEditEventBusKey: EventBusKey<string> = Symbol(
  "organizationUnit.edit"
);

export const onDeleteEventBusKey: EventBusKey<string> = Symbol(
  "organizationUnit.delete"
);

export const onViewEventBusKey: EventBusKey<{
  id: string;
  displayName: string;
}> = Symbol("organizationUnit.onSelectedEventBusKey");

export { useCreateOrganizationUnitForm } from "./createOrganizationUnit";
export { useOrganizationUnitList } from "./organizationUnitList";
export { useUpdateOrganizationUnitForm } from "./updateOrganizationUnit";
