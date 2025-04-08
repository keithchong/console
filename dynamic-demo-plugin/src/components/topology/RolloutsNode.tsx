import * as React from 'react';
import {  Node, observer, WithContextMenuProps, WithDndDropProps, WithDragNodeProps, WithSelectionProps } from '@patternfly/react-topology';
import { connect } from 'react-redux';

type RolloutsNodeProps = {
  serviceBinding,
  element: Node;
} & WithSelectionProps & WithDndDropProps & WithContextMenuProps & WithDragNodeProps;

const RolloutsNode: React.FC<RolloutsNodeProps> = ({
  serviceBinding,
  element,
  onSelect, 
  selected,
  ...rest
}) => {
  return (
      <>   
        <circle
          fill="var(--pf-v5-global--palette--white)"
          cx={100}
          cy={100}
          r={100 + 6}
        ></circle>
        <rect fill="red" x1={25} y1={35} x2={75} y2={65} height={20} width={30}></rect>
      </>
  )
}


interface StateProps {
  serviceBinding: boolean;
}

const getServiceBindingStatus = ({ FLAGS }: any): boolean =>
  FLAGS.get('ALLOW_SERVICE_BINDING');
export const mapStateToProps = (state: any): StateProps => {
  return {
    serviceBinding: getServiceBindingStatus(state),
  };
};

export default connect(mapStateToProps)(observer(RolloutsNode));
