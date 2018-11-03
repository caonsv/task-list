const urlAPI = 'http://localhost:8080/api/tareas/',
    taskListToDo = $('#task-list-todo'),
    taskListInProgress = $('#task-list-inprogress'),
    taskListDone = $('#task-list-done'),
    taskListDeleted = $('#task-list-deleted')
let print

$(document).ready(function () {
    createFront()
})

function emptyFront() {
    taskListToDo.empty()
    taskListInProgress.empty()
    taskListDone.empty()
    taskListDeleted.empty()
    createFront()
}

function createFront() {
    fetch(urlAPI + 'todo')
        .then(function (response) { return response.json() })
        .then(function (db_task) {
            db_task.length !== 0 ? print = printHTML(db_task, 'bg-light', false, true, true, true, true) : print = 'No task todo yet...'
            taskListToDo.html(print)
            $('#count-todo').text(db_task.length)
        });

    fetch(urlAPI + 'inprogress')
        .then(function (response) { return response.json() })
        .then(function (db_task) {
            db_task.length !== 0 ? print = printHTML(db_task, 'primary', true, true, true, false, true) : print = 'No task in progress yet...'
            taskListInProgress.html(print)
            $('#count-inprogress').text(db_task.length)
        });

    fetch(urlAPI + 'done')
        .then(function (response) { return response.json() })
        .then(function (db_task) {
            db_task.length !== 0 ? print = printHTML(db_task, 'warning', false, false, false, true, true) : print = 'No task done yet...'
            taskListDone.html(print)
            $('#count-done').text(db_task.length)
        });

    fetch(urlAPI + 'deleted')
        .then(function (response) { return response.json() })
        .then(function (db_task) {
            db_task.length !== 0 ? print = printHTML(db_task, 'danger', false, true, false, false, true) : print = 'No task deleted yet...'
            taskListDeleted.html(print)
            $('#count-deleted').text(db_task.length)
        });
    fetch(urlAPI + 'total')
        .then(function (response) { return response.json() })
        .then(function (db_task) {
            $('#total-task-created').html('Total created: '+db_task.count_total+'<br/>Live task: '+db_task.count_live)
            $('#definitly-deleted').html('Permanently deleted: '+ (db_task.count_total-db_task.count_live))
        });
}

function printHTML(list, status, _todo, _done, _edit, _inprogress, _delete) {
    let listComplete = ''

    for (var k in list) {
        let date = list[k].date,
            title = list[k].title,
            description = list[k].description,
            id = list[k].id

        k++
        listComplete += `
                        <div id="${id}" class="tasks list-group-item list-group-item-${status} list-group-item-action flex-column align-items-start">
                            <div class="d-flex w-100 justify-content-between">
                                <h6 class="mb-1">${title}</h6>
                                <div class="text-right">
                                    <small>${date}</small>
                                    <div class="actions-tasks">
                                        <button type="button" class="btn btn-sm btn-secondary ${!_todo && 'hidden'}" title="go back to pending">
                                            <i class="material-icons" onclick="fetchPUT_status('${id}', 'TODO')">reply</i> 
                                        </button>
                                        <button type="button" class="btn btn-sm btn-success ${!_done && 'hidden'}" title="This task is done">
                                            <i class="material-icons" onclick="fetchPUT_status('${id}', 'DONE')">done</i> 
                                        </button>
                                        <button type="button" class="btn btn-sm btn-warning ${!_edit && 'hidden'}" title="Edit this task">
                                            <i class="material-icons" onclick="newOrEdit('${id}')">edit</i> 
                                        </button>
                                        <button type="button" class="btn btn-sm btn-primary ${!_inprogress && 'hidden'}" title="Set task to in progress">
                                            <i class="material-icons" onclick="fetchPUT_status('${id}', 'IN PROGRESS')">play_arrow</i> 
                                        </button>
                                        <button type="button" class="btn btn-sm btn-danger ${!_delete && 'hidden'}" title="Delete this task">
                                            <i class="material-icons" onclick="fetchPUT_status('${id}', 'DELETED')">delete</i> 
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p class="mb-1">${description}</p>
                        </div>
                    `
    }
    return listComplete
}