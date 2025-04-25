import request from '@/utils/request'

// 查询民宿评价列表
export function listEvaluate(query) {
  return request({
    url: '/huacai/evaluate/list',
    method: 'get',
    params: query
  })
}

// 查询民宿评价详细
export function getEvaluate(evaluateId) {
  return request({
    url: '/huacai/evaluate/' + evaluateId,
    method: 'get'
  })
}

// 新增民宿评价
export function addEvaluate(data) {
  return request({
    url: '/huacai/evaluate',
    method: 'post',
    data: data
  })
}

// 修改民宿评价
export function updateEvaluate(data) {
  return request({
    url: '/huacai/evaluate',
    method: 'put',
    data: data
  })
}

// 删除民宿评价
export function delEvaluate(evaluateId) {
  return request({
    url: '/huacai/evaluate/' + evaluateId,
    method: 'delete'
  })
}

// 根据民宿ID查询评价
export function selectEvaluateByHomestayId(homestayId) {
  return request({
    url: '/huacai/evaluate/selectEvaluateByHomestayId/' + homestayId,
    method: 'get'
  })
}
