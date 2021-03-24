import request from './request'

export function getTableList(param) {
  return request({
    url: 'http://localhost:18011/projects/page',
    method: 'post',
    data: param
  })
}

export function insertProject(param) {
  return request({
    url: 'http://localhost:18011/projects',
    method: 'post',
    data: param
  })
}

export function updateProject(param) {
  return request({
    url: 'http://localhost:18011/projects',
    method: 'put',
    data: param
  })
}

export function deleteProject(param) {
  return request({
    url: 'http://localhost:18011/projects',
    method: 'delete',
    params: {
      projectId: param
    }
  })
}

export function getDocumentList(param) {
  return request({
    url: 'http://localhost:18011/documents/page',
    method: 'post',
    data: param
  })
}

export function addDocument(param) {
  return request({
    url: 'http://localhost:18011/documents',
    method: 'post',
    data: param
  })
}

export function deleteDocument(param) {
  return request({
    url: 'http://localhost:18011/documents',
    method: 'delete',
    params: {
      documentId: param
    }
  })
}
export function uploadFile(param) {
  return request({
    url: 'http://localhost:18011/files',
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getImageList() {
  return request({
    url: 'http://localhost:18011/files/image',
    method: 'get'
  })
}

export function getFolderList() {
  return request({
    url: 'http://localhost:18011/folder',
    method: 'get'
  })
}

export function insertFolder(param) {
  return request({
    url: 'http://localhost:18011/folder',
    method: 'post',
    data: param
  })
}

export function updateFolder(param) {
  return request({
    url: 'http://localhost:18011/folder',
    method: 'put',
    data: param
  })
}

export function deleteFolder(param) {
  return request({
    url: 'http://localhost:18011/folder',
    method: 'delete',
    params: {
      folderId: param
    }
  })
}

export function downloadFile(param) {
  return request({
    url: 'http://localhost:18011/files',
    method: 'get',
    params: {
      filePath: param
    },
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    },
    responseType: 'blob'
  })
}

