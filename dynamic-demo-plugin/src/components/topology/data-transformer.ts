import { K8sResourceKind,  } from '@openshift-console/dynamic-plugin-sdk';
import { OverviewItem, TopologyDataObject, TopologyDataResources } from '@openshift-console/dynamic-plugin-sdk/lib/extensions/topology-types';
import { DragObjectWithType, DragSourceSpec, DragSpecOperationType, GraphElement, Node, NodeModel, NODE_DRAG_TYPE, noDropTargetSpec, observer, WithContextMenuProps, withDndDrop, DragOperationWithType } from '@patternfly/react-topology';
import { Model } from '@patternfly/react-topology/dist/esm/types';
import * as _ from 'lodash';
import * as React from 'react';
import { createRolloutItems, getGitOpsTopologyNodeItems } from './gitops-topology-types';
import { ActionContext } from '@openshift-console/dynamic-plugin-sdk/lib/api/internal-types';
import RolloutsNode from './RolloutsNode';

export const mergeGroup = (newGroup: NodeModel, existingGroups: NodeModel[]): void => {
  if (!newGroup) {
    return;
  }

  // Remove any children from the new group that already belong to another group
  newGroup.children = newGroup.children?.filter(
    (c) => !existingGroups?.find((g) => g.children?.includes(c)),
  );

  // find and add the groups
  const existingGroup = existingGroups.find((g) => g.group && g.id === newGroup.id);
  if (!existingGroup) {
    existingGroups.push(newGroup);
  } else {
    newGroup.children.forEach((id) => {
      if (!existingGroup.children.includes(id)) {
        existingGroup.children.push(id);
      }
      mergeGroupData(newGroup, existingGroup);
    });
  }
};

const mergeGroupData = (newGroup: NodeModel, existingGroup: NodeModel): void => {
  if (!existingGroup.data?.groupResources && !newGroup.data?.groupResources) {
    return;
  }

  if (!existingGroup.data?.groupResources) {
    existingGroup.data.groupResources = [];
  }
  if (newGroup?.data?.groupResources) {
    newGroup.data.groupResources.forEach((obj) => {
      if (!existingGroup.data.groupResources.includes(obj)) {
        existingGroup.data.groupResources.push(obj);
      }
    });
  }
};

export const getRolloutTopologyDataModel = (
  namespace: string,
  resources: TopologyDataResources,
): Promise<Model> => {
  const rolloutsTopologyGraphModel: Model = { nodes: [], edges: [] };

  const rollouts = resources?.rollouts?.data;  // K8sResourceKind

  rollouts.forEach((res: K8sResourceKind) => {
     const item = createRolloutItems(res, resources);
     const data = createTopologyServiceNodeData(res, item, "rollout", resources);
     rolloutsTopologyGraphModel.nodes.push(...getGitOpsTopologyNodeItems(res, "rollout", data, resources));
  });

  return Promise.resolve(rolloutsTopologyGraphModel);
}

export const DEFAULT_NODE_PAD = 20;
export const DEFAULT_GROUP_PAD = 40;
export const GROUP_WIDTH = 300;
export const GROUP_HEIGHT = 180;
export const GROUP_PADDING = [
  DEFAULT_GROUP_PAD,
  DEFAULT_GROUP_PAD,
  DEFAULT_GROUP_PAD + 20,
  DEFAULT_GROUP_PAD,
];

export const getTopologyGroupItems = (dc: K8sResourceKind): NodeModel => {
  const groupName = _.get(dc, ['metadata', 'labels', 'app.kubernetes.io/part-of']);
  if (!groupName) {
    return null;
  }
  const TYPE_APPLICATION_GROUP = 'part-of';

  return {
    id: `group:${groupName}`,
    type: TYPE_APPLICATION_GROUP,
    group: true,
    label: groupName,
    children: [_.get(dc, ['metadata', 'uid'])],
    width: GROUP_WIDTH,
    height: GROUP_HEIGHT,
    data: {},
    visible: true,
    collapsed: false,
    style: {
      padding: GROUP_PADDING,
    },
  };
};

export const createTopologyServiceNodeData = (
  resource: K8sResourceKind,
  overviewItem: OverviewItem,
  type: string,
  resources: TopologyDataResources,
): TopologyDataObject => {
  const uid = _.get(resource, 'metadata.uid');
  const labels = _.get(resource, 'metadata.labels', {});
  const annotations = _.get(resource, 'metadata.annotations', {});
  return {
    id: uid,
    name: _.get(resource, 'metadata.name') || labels['app.kubernetes.io/instance'],
    type,
    resource,
    resources: {...overviewItem},
    data: {
      editURL: annotations['app.openshift.io/edit-url'],
      vcsURI: annotations['app.openshift.io/vcs-uri'],
      vcsRef: annotations['app.openshift.io/vcs-ref']
    },
  };
};

type NodeComponentProps = {
  element: GraphElement;
};

type EditableDragOperationType = DragOperationWithType & {
  edit?: boolean;
  canDropOnNode?: (operationType: string, dragElement: GraphElement, node: Node) => boolean;
};

export const noRegroupDragSourceSpec: DragSourceSpec<
  DragObjectWithType,
  DragSpecOperationType<EditableDragOperationType>,
  Node,
  {
    dragging?: boolean;
  },
  NodeComponentProps
> = {
  item: { type: NODE_DRAG_TYPE },
  collect: (monitor) => ({
    dragging: monitor.isDragging(),
  }),
};

export const getKnativeEventingComponentFactory = (kind, type): React.ComponentType<{ element: GraphElement }> | undefined => {
  return undefined;
}

export const contextMenuActions = (element: GraphElement) => {
  const resource = undefined;
  const { csvName } = element.getData()?.data ?? {};
  return {
    'topology-actions': element,
    ...({}),
    ...(csvName ? { 'csv-actions': { csvName, resource } } : {}),
  };
};

const withTopologyContextMenu = <E extends GraphElement>(
  actionContext: (element: E) => ActionContext,
  container?: Element | null | undefined | (() => Element),
  className?: string,
  atPoint: boolean = true,
) => <P extends WithContextMenuProps>(WrappedComponent: React.ComponentType<Partial<P>>) => {
  return observer(React.Component);
};

export const withContextMenu = <E extends GraphElement>(actions: (element: E) => ActionContext) => {
  return withTopologyContextMenu(
    actions,
    document.getElementById('popper-container'),
    'odc-topology-context-menu',
  );
};

export const withNoDrop = () => {
  return withDndDrop<any, any, {}, NodeComponentProps>(noDropTargetSpec);
};

// ViewComponentFactory
export const getRolloutComponentFactory = (kind, type): React.ComponentType<{ element: GraphElement }> | undefined => {

  if (type === "rollout") {
      return RolloutsNode
      // return withSelection({controlled: true})(withNoDrop()(withDragNode(noRegroupDragSourceSpec)(WorkloadPodsNode)));
      // return withSelection({controlled: true})(withNoDrop()(withDragNode(noRegroupDragSourceSpec)(WorkloadPodsNode)));
      // return withSelection({ controlled: true })(
      //   withContextMenu(contextMenuActions)(
      //     withNoDrop()(withDragNode(noRegroupDragSourceSpec)(RolloutsNode)),
      //   ),
      // );
  }
  return undefined;
};
