import * as React from 'react';
import { TableData, TableRow } from '@console/internal/components/factory';
import * as classNames from 'classnames';
import './GitOpsDeploymentHistory.scss';
import { Timestamp, ExternalLink } from '@console/internal/components/utils';
import { GreenCheckCircleIcon, RedExclamationCircleIcon } from '@console/shared';
import { Flex, FlexItem } from '@patternfly/react-core';

import './GitOpsDeploymentHistoryTableRow.scss';
import { tableColumnClasses } from './history-table';

const GitOpsDeploymentHistoryTableRow = ({ obj: data, index, key, style }) => {
  const outcomeIcon =
    data.outcome === 'Succeeded' ? <GreenCheckCircleIcon /> : <RedExclamationCircleIcon />;
  return (
    <TableRow id={data.environment} index={index} trKey={key} style={style}>
      <TableData className={tableColumnClasses[0]}>
        <Timestamp timestamp={data.last_deployment} />
      </TableData>
      <TableData className={classNames(tableColumnClasses[1], 'co-break-word')}>
        {data.description}
      </TableData>
      <TableData className={classNames(tableColumnClasses[2], 'co-break-word')}>
        {data.environment}
      </TableData>
      <TableData className={tableColumnClasses[3]}>
        <Flex className="odc-gitops-history-outcome">
          <Flex flex={{ default: 'flex_1' }}>
            <FlexItem>
              <div>
                {outcomeIcon} {data.outcome}
              </div>
            </FlexItem>
          </Flex>
        </Flex>
      </TableData>
      <TableData className={tableColumnClasses[4]}>{data.author}</TableData>
      <TableData className={tableColumnClasses[5]}>
        <ExternalLink href={data.revision} additionalClassName={'co-break-all'}>
          <span style={{ marginRight: 'var(--pf-global--spacer--xs)' }}>{data.revision}</span>
        </ExternalLink>
      </TableData>
    </TableRow>
  );
};

export default GitOpsDeploymentHistoryTableRow;
