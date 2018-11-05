var richTextEditor = new Simditor({
    textarea: $('#taskdescription')
})

const idTask = document.getElementById('idTaskEdit'),
    title = $('#taskname'),
    description = $('#taskdescription')

function newOrEdit(id) {
    id ? editTask(id) : newTask()
    $('#msjFail').text("")
}

function newTask() {
    $('#newTask').modal('show')
    $('#sendTask').attr('onclick', 'fetchPOST()')
    //clean form
    title.val('')
    description.val('')
    richTextEditor.setValue('');
    idTask.innerText = ''
}

function seeTask(id) {
    //seeTask
    fetch(urlAPI + id)
        .then(function (response) { return response.json() })
        .then(function (db_task) {
            //set data form
            $('#seeTask').modal('show')
            $('.title-of-task').html(db_task.title)
            $('.content-of-task').html(db_task.description)
            db_task.status !== 'TODO' && db_task.status !== 'IN PROGRESS'
                ? $('#modal-edit-task').hide()
                : $('#modal-edit-task').show().attr('onclick', `editTask("${id}")`)
        });
}

function editTask(id) {
    $('#seeTask').modal('hide')
    $('#newTask').modal('show')
    fetch(urlAPI + id)
        .then(function (response) { return response.json() })
        .then(function (db_task) {
            //set data form

            title.val(db_task.title)
            description.val(db_task.description)
            richTextEditor.setValue(db_task.description)
            idTask.innerText = 'Edit ID: ' + id
            $('#sendTask').attr('onclick', `fetchPUT("${id}", "${db_task.status}")`).text('Save')
        });
}

function fetchPOST() {
    let data = {
        title: title.val(),
        description: description.val(),
        status: 'TODO'
    };

    if (title.val()) {
        fetch(urlAPI, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(response => {
                //console.log('Success:', response)
                $('#newTask').modal('hide')
                emptyFront()
            })
            .catch(error => console.log('Error:', error))
    } else {
        $('#msjFail').text("Title can't be empty")
    }
}

function fetchPUT(id, status) {
    let data = {
        title: title.val(),
        description: description.val(),
        id,
        status
    };

    if (title.val()) {
        fetch(urlAPI, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(response => {
                //console.log('Success:', response)
                $('#newTask').modal('hide')
                emptyFront()
            })
            .catch(error => console.log('Error:', error))
    } else {
        $('#msjFail').text("Title can't be empty")
    }
}

function fetchPUT_status(id, nextStatus) {
    fetch(urlAPI + id)
        .then(function (response) { return response.json() })
        .then(function (db_task) {
            let { title, id, status, date, description } = db_task

            let data = {
                title,
                date,
                id,
                description,
                status: nextStatus
            };

            function putNoDeleted() {
                fetch(urlAPI, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(res => res.json())
                    .then(response => {
                        //console.log('Success:', response)
                        emptyFront()
                    })
                    .catch(error => console.log('Error:', error))
            }

            if (status !== 'DELETED') {
                putNoDeleted()
            } else {
                if (nextStatus !== 'DELETED') {
                    putNoDeleted()
                } else {
                    var confirmDel = confirm("¿Are you sure delete permanently this task?");
                    if (confirmDel) {
                        fetch(urlAPI, {
                            method: 'DELETE',
                            body: JSON.stringify({ id }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(res => res.json())
                            .then(response => {
                                //console.log('Success:', response)
                                emptyFront()
                            })
                            .catch(error => console.log('Error:', error))
                    }
                }
            }
        });
}