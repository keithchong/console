import { K8sResourceCommon, Selector } from '@openshift-console/dynamic-plugin-sdk';
  
export type RolloutKind = {
    spec: {
      minReadySeconds?: number;
      paused?: boolean;
      progressDeadlineSeconds?: number;
      replicas?: number;
      revisionHistoryLimit?: number;
      selector: Selector;
      strategy?: {
        rollingUpdate?: {
          maxSurge: number | string;
          maxUnavailable: number | string;
        };
        type?: string;
      };
      template: any; // PodTemplate;
    };
    status?: {
      availableReplicas?: number;
      collisionCount?: number;
      conditions?: any; // DeploymentCondition[];
      observedGeneration?: number;
      readyReplicas?: number;
      replicas?: number;
      unavailableReplicas?: number;
      updatedReplicas?: number;
    };
  } & K8sResourceCommon;