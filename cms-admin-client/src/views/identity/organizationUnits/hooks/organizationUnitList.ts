import { OrganizationUnitService, OrganizationUnitDto } from "@/openapi";

export type Tree = {
  id: string;
  displayName: string;
  orgNo: string;
  code: string;
  children: Tree[];
};

export const useOrganizationUnitList = () => {
  const list = ref<OrganizationUnitDto[]>([]);
  const filter = ref("");
  const pageable = reactive<Pageable>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });

  const getList = async () => {
    const res = await OrganizationUnitService.organizationUnitGetList({
      filter: filter.value,
      skipCount: (pageable.pageNum - 1) * pageable.pageSize,
      maxResultCount: pageable.pageSize,
    });

    list.value = res.items!;
    pageable.total = res.totalCount!;
  };

  const getTree = async (tree: Tree[]) => {
    const res =
      await OrganizationUnitService.organizationUnitGetVisibleOrganizationUnits();
    transformData(res.items!, tree);
  };

  //transform OrganizationUnitDto to Tree
  const transformData = (data: OrganizationUnitDto[], result: Tree[]) => {
    const map: { [key: string]: Tree } = {};
    data.forEach((item) => {
      map[item.id!] = {
        id: item.id!,
        displayName: item.displayName!,
        orgNo: item.extraProperties?.OrgNo!,
        code: item.code!,
        children: [],
      };
    });

    data.forEach((item) => {
      const parent = map[item.parentId!];
      if (parent) {
        parent.children.push(map[item.id!]);
      } else {
        result.push(map[item.id!]);
      }
    });
  };

  return { list, filter, pageable, getList, getTree };
};
