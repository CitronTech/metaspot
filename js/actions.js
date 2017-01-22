import 'isomorphic-fetch'

const URL = ''

export function init() {
  return dispatch => {
    return fetch(URL).then(function(rsp) {
        if (rsp.status == 200) {
          console.log(rsp)
        } else {
          
        }
      }
    )
  }
}