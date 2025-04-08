import { K8sResourceKind, K8sResourceKindReference } from '@openshift-console/dynamic-plugin-sdk';
import { OdcNodeModel, OverviewItem, TopologyDataObject, TopologyDataResources } from '@openshift-console/dynamic-plugin-sdk/lib/extensions/topology-types';
import { Model, NodeModel, NodeShape } from "@patternfly/react-topology";
import * as _ from 'lodash';

export const getOwnedResources = <T extends K8sResourceKind>(
    obj: K8sResourceKind,
    resources: T[],
    ): T[] => {
    const uid = obj?.metadata?.uid;
    if (!uid) {
        return [];
    }
    return _.filter(resources, ({ metadata: { ownerReferences } }) => {
        return _.some(ownerReferences, {
        uid,
        controller: true,
        });
    });
};

export const transformRolloutNodeData = (
    knResourcesData: K8sResourceKind[],
    type: string,
    resources: TopologyDataResources,
  ): Model => {
    const knDataModel: Model = { nodes: [], edges: [] };
    return knDataModel;
  };
    
export const createRolloutItems = (
  resource: K8sResourceKind,
  resources: TopologyDataResources,
): OverviewItem => {
  let associatedDeployment = getOwnedResources(resource, resources.deployments.data);
  associatedDeployment = [
    ...associatedDeployment,
  ];
  if (!_.isEmpty(associatedDeployment)) {
    const overviewItems: OverviewItem = {
      obj: resource,
    };
    return overviewItems;
  }
};
  
  export const getGitOpsTopologyNodeItems = (
    resource: K8sResourceKind,
    type: string,
    data: TopologyDataObject,
    resources?: TopologyDataResources,
  ): NodeModel[] => {
    const nodes = [];
    const children: string[] = [];
    console.log("DYNAMIC PLUGIN - getNodeItems - resource is " + resource.metadata?.name);
    nodes.push(getTopologyNodeItem(resource, type, data, getGitOpsNodeModelProps(type), children));
    return nodes;
  };  
  
  export const getTopologyNodeItem = (
    resource: K8sResourceKind,
    type: string,
    data: any,
    nodeProps?: Omit<OdcNodeModel, 'type' | 'data' | 'children' | 'id' | 'label'>,
    children?: string[],
    resourceKind?: K8sResourceKindReference,
    shape?: NodeShape,
  ): OdcNodeModel => {
    const uid = resource?.metadata.uid;
    const name = resource?.metadata.name;
    const label = resource?.metadata.labels?.['app.openshift.io/instance'];
    const kind = "argoproj.io~v1alpha1~Rollout";
    console.log("****** DYNAMIC PLUGIN - getTopologyNodeItem name=" + name);

    return {
      id: uid,
      type,
      label: label || name,
      shape,
      resource,
      resourceKind: kind,
      data,
      ...(children && children.length && { children }),
      ...(nodeProps || {}),
    };
  };
    
  export const getGitOpsNodeModelProps = (type: string) => {
        console.log("getGitOpsNodeModelProps =========== TYPE is " + type);
        return {
            width: 104,
            height: 104,
            visible: true,
            collapsed: false,
            group: false,
            shape: NodeShape.rect,
            style: {
                padding: NODE_PADDING,
            },
        };
  };
  
  export const NODE_PADDING = [0, 20];
  
  export const DEFAULT_GROUP_PAD = 40;
  
  export const KNATIVE_GROUP_NODE_PADDING = [
    DEFAULT_GROUP_PAD,
    DEFAULT_GROUP_PAD,
    DEFAULT_GROUP_PAD + 10,
    DEFAULT_GROUP_PAD,
  ];