const urlAPI = 'http://localhost:8080/api/',
    taskListToDo = $('#task-list-todo'),
    taskListInProgress = $('#task-list-inprogress'),
    taskListDone = $('#task-list-done'),
    taskListDeleted = $('#task-list-deleted')
let print



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
            db_task.length !== 0 ? print = printHTML(db_task, 'warning', true, false, true, true, true, true) : print = '<div class="no-yet">No task to do yet...</div>'
            taskListToDo.html(print)
            $('#count-todo').text(db_task.length)
        });

    fetch(urlAPI + 'inprogress')
        .then(function (response) { return response.json() })
        .then(function (db_task) {
            db_task.length !== 0 ? print = printHTML(db_task, 'primary', true, true, true, true, false, true) : print = '<div class="no-yet">No task in progress yet...</div>'
            taskListInProgress.html(print)
            $('#count-inprogress').text(db_task.length)
        });

    fetch(urlAPI + 'done')
        .then(function (response) { return response.json() })
        .then(function (db_task) {
            db_task.length !== 0 ? print = printHTML(db_task, 'success', true, false, false, false, true, true) : print = '<div class="no-yet">No task done yet...</div>'
            taskListDone.html(print)
            $('#count-done').text(db_task.length)
        });

    fetch(urlAPI + 'deleted')
        .then(function (response) { return response.json() })
        .then(function (db_task) {
            db_task.length !== 0 ? print = printHTML(db_task, 'danger', true, false, true, false, false, true) : print = '<div class="no-yet">No task deleted yet...</div>'
            taskListDeleted.html(print)
            $('#count-deleted').text(db_task.length)
        });
    fetch(urlAPI + 'total')
        .then(function (response) { return response.json() })
        .then(function (db_task) {
            $('#total-task-created').html(`
                <div class="mr-5">Total tasks created: ${db_task.count_total}</div>
                <div class="mr-5">Live tasks: ${db_task.count_live}</div>
                <div>Permanently deleted tasks: ${(db_task.count_total - db_task.count_live)}</div>
            `)
        });
}

function printHTML(list, status, _open, _todo, _done, _edit, _inprogress, _delete) {
    let listComplete = ''

    for (var k in list) {
        let date = list[k].date,
            title = list[k].title,
            description = list[k].description,
            id = list[k].id

        k++
        listComplete += `
                        <li class="tasks list-group-item list-group-item-${status} align-items-end p-2" ondblclick="seeTask('${id}')">
                            <div class="d-block pb-2 pt-2">
                                <p class="mb-1 pr-3 task-title"><small>${k}-</small> ${title}</p>
                                <small class="mb-2 task-description">${description}</small>
                                <i class="material-icons tasks-date" data-toggle="tooltip" data-placement="auto" title="${date}">access_time</i>
                            </div>
                            <div class="see-more" onclick="seeTask('${id}')">Open task!</div>
                            <div class="actions-tasks d-block">
                                <button type="button" class="btn btn-sm btn-dark py-0 px-1 ${!_open && 'hidden'}" title="Open task">
                                    <i class="material-icons" onclick="seeTask('${id}')">open_in_new</i> 
                                </button>    
                                <button type="button" class="btn btn-sm btn-warning py-0 px-1 ${!_todo && 'hidden'}" title="Go back to pending (to do list)">
                                    <i class="material-icons" onclick="fetchPUT_status('${id}', 'TODO')">reply</i> 
                                </button>
                                <button type="button" class="btn btn-sm btn-success py-0 px-1 ${!_done && 'hidden'}" title="This task is done">
                                    <i class="material-icons" onclick="fetchPUT_status('${id}', 'DONE')">done</i> 
                                </button>
                                <button type="button" class="btn btn-sm btn-violet py-0 px-1 ${!_edit && 'hidden'}" title="Edit this task">
                                    <i class="material-icons" onclick="newOrEdit('${id}')">edit</i> 
                                </button>
                                <button type="button" class="btn btn-sm btn-info py-0 px-1 ${!_inprogress && 'hidden'}" title="Set task to in progress">
                                    <i class="material-icons" onclick="fetchPUT_status('${id}', 'IN PROGRESS')">play_arrow</i> 
                                </button>
                                <button type="button" class="btn btn-sm btn-danger py-0 px-1 ${!_delete && 'hidden'}" title="Delete this task">
                                    <i class="material-icons" onclick="fetchPUT_status('${id}', 'DELETED')">delete</i> 
                                </button>
                            </div>
                        </li>
                    `
    }
    return listComplete
}

//READY LOAD
$(document).ready(function () {
    createFront()

    //JQUERY START COMPONENT
    $('[data-toggle="tooltip"]').tooltip()
})