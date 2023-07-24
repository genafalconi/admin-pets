import { MdOutlineDone, MdOutlineCancel } from 'react-icons/md';
import { LuPackageCheck } from 'react-icons/lu';
import { CgSandClock } from 'react-icons/cg';
import { ord_constants } from './constants';

export default function handleStatusOrder(status) {
  let icon = ''
  switch (status) {
    case ord_constants.CONFIRMED:
      icon = <MdOutlineDone />
      return icon
    case ord_constants.DELIVERED:
      icon = <LuPackageCheck />
      return icon
    case ord_constants.PROGRESS:
      icon = <CgSandClock />
      return icon
    case ord_constants.CANCELLED:
      icon = <MdOutlineCancel />
      return icon
    default:
      return icon
  }
}