/* globals fetch */
var update = document.getElementById('update-patients')
var del = document.getElementById('delete')

update.addEventListener('click', function () {
  fetch('update-patients', {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'name': 'Matt',
      'type': 'Outpatient'
    })
  })
  .then(response => {
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
  })
})

del.addEventListener('click', function () {
  fetch('wards', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      '_id': '1'
    })
  }).then(function (response) {
    window.location.reload()
  })
})
