import request from '@/utils/request'

// 查询民宿订单列表
export function listOrders(query) {
  return request({
    url: '/huacai/orders/list',
    method: 'get',
    params: query
  })
}

// 查询民宿订单详细
export function getOrders(orderId) {
  return request({
    url: '/huacai/orders/' + orderId,
    method: 'get'
  })
}

// 新增民宿订单
export function addOrders(data) {
  return request({
    url: '/huacai/orders',
    method: 'post',
    data: data
  })
}

// 修改民宿订单
export function updateOrders(data) {
  return request({
    url: '/huacai/orders',
    method: 'put',
    data: data
  })
}

// 删除民宿订单
export function delOrders(orderId) {
  return request({
    url: '/huacai/orders/' + orderId,
    method: 'delete'
  })
}

//订单支付
export function payOrder(orderId) {
  return request({
    url: '/huacai/orders/payOrder/' + orderId,
    method: 'put'
  })
}
