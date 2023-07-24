import { ord_constants } from "./constants"

export default function handleBadge(status) {
  const badge = {
    variant: 'primary',
    text: 'CONFIRMADO'
  }
  switch (status) {
    case ord_constants.CONFIRMED:
      badge.variant = 'primary'
      badge.text = 'CONFIRMADO'
      return badge
    case ord_constants.DELIVERED:
      badge.variant = 'success'
      badge.text = 'ENTREGADO'
      return badge
    case ord_constants.PROGRESS:
      badge.variant = 'warning'
      badge.text = 'EN PROCESO'
      return badge
    case ord_constants.CANCELLED:
      badge.variant = 'danger'
      badge.text = 'CANCELADO'
      return badge
    default:
      return badge
  }
}