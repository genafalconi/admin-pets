import { HiOutlineArrowsRightLeft } from 'react-icons/hi2'
import { TbTruckDelivery } from 'react-icons/tb'

export const req_constants = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE'
}

export const ord_constants = {
  DELIVERED: 'DELIVERED',
  CONFIRMED: 'CONFIRMED',
  PROGRESS: 'PROGRESS',
  CANCELLED: 'CANCELLED'
}

export const navItems = [
  {
    name: 'Entregas',
    Icon: <TbTruckDelivery size={25} />,
    img: null
  },
  {
    name: 'Ventas',
    Icon: <HiOutlineArrowsRightLeft size={25} />,
    img: null
  },
  {
    name: 'Compras',
    Icon: null,
    img: 'Admin/donation_qviypz'
  },
  {
    name: 'Clientes',
    Icon: null,
    img: 'Admin/user_iqpafj'
  },
  {
    name: 'Productos',
    Icon: null,
    img: 'Admin/dog-food_hraqgm'
  },
  {
    name: 'Reportes',
    Icon: null,
    img: 'Admin/sell_fokgpp'
  },
]

export const paymentsType = {
  CASH: 'CASH',
  MP: 'MP',
  TRANSFERENCIA: 'TRANSFERENCIA'
}