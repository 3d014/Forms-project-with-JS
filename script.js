
let db = null;
let counter = 0
function create_db() {
    const request = window.indexedDB.open("MyDataBase")

    request.onerror = function (event) {
        console.log("Problem opening DB")
    }

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        const store = db.createObjectStore("templates", { keyPath: 'formName' })
        store.transaction.oncomplete = function (event) {
            console.log("store created")
        }
        alert('f')

    }

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log("successfully opened DB")
    }
}


create_db()



function insertFormTemplate(formTemplate) {
    if (db) {
        const tx = db.transaction('templates', 'readwrite')
        const store = tx.objectStore('templates')

        tx.onerror = () => {
            console.log("problem with transaction")
        }

        tx.oncomplete = () => {
            console.log('transaction good')
        }

        let request = store.add(formTemplate)
        request.onerror = (event) => {
            console.log('could not add', formTemplate)

        }
        request.oncomplete = (event) => {
            console.log('successfully added form template')
        }
    }

}

async function makeStore(name) {
    version = db.version
    version += 1
    await db.close()


    const request = window.indexedDB.open("MyDataBase", version)

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        const store = db.createObjectStore(name, { autoIncrement: true })
        store.transaction.oncomplete = function (event) {
            console.log("store created")
        }


    }
    request.onsuccess = function (event) {
        db = event.target.result;
        console.log("successfully opened DB")
    }

}




function insertData(data, storeName) {
    if (db) {
        const tx = db.transaction(storeName, 'readwrite')
        const store = tx.objectStore(storeName)

        tx.onerror = () => {
            console.log("problem with transaction")
        }

        tx.oncomplete = () => {
            console.log('transaction good')
        }

        let request = store.add(data)
        request.onerror = (event) => {
            console.log('could not add', data)

        }
        request.oncomplete = (event) => {
            console.log('successfully added form template')
        }
    }
}
function updateData(data, storeName, id) {
    if (db) {
        const tx = db.transaction(storeName, 'readwrite')
        const store = tx.objectStore(storeName)
        id = parseInt(id)
        tx.onerror = () => {
            console.log("problem with transaction")
        }

        tx.oncomplete = () => {

            console.log('transaction good')
        }

        let request = store.put(data, id)
        request.onerror = (event) => {
            console.log('could not put', data)

        }
        request.oncomplete = (event) => {
            console.log('successfully put data')
        }
    }
}

async function getTemplate(templateName) {
    let template = null;
    if (db) {
        const tx = await db.transaction('templates', 'readonly')
        const store = await tx.objectStore('templates')

        tx.onerror = () => {
            console.log("problem with transaction")
        }

        tx.oncomplete = () => {
            console.log('transaction good')
        }

        return new Promise(function (resolve, reject) {

            let request = store.get(templateName)
            request.onerror = (event) => {
                console.log('could not get', templateName)
                reject(request.result)


            }
            request.onsuccess = (event) => {
                resolve(request.result)


            }
        })
    }
}

async function putFormular(template) {
    if (db) {
        const tx = await db.transaction('templates', 'readwrite')
        const store = await tx.objectStore('templates')

        tx.onerror = () => {
            console.log("problem with transaction")
        }

        tx.oncomplete = () => {
            console.log('transaction good')
        }

        let request = store.put(template)
        request.onerror = function (event) {
            console.log('could not add', template)
        }
        request.onsuccess = function () {
            console.log('successfully added', template)
        }
    }
}




function displayForm() {
    let inputArea = document.querySelector('.searchInput')
    if (inputArea.value == "") {
        makeForm(inputArea.value)
    } else {

        getTemplate(inputArea.value).then(e => {
            if (typeof (e) == "undefined") {

                makeForm(inputArea.value)
            } else {
                showForm(e)
            }
        })

    }


}

let search = 0;

let dropdown1 = ['textbox', 'checkbox', 'radio button']
let dropdown2 = ['none', 'numeric', 'mandatory']

function makeForm(templateName) {


    const formMaker = (templateName) => {
        let formTemplate = document.createElement('form')
        formTemplate.setAttribute('class', 'formTemplate')
        formTemplate.addEventListener('submit', e => {
            e.preventDefault()
            makeFormular(e.target)

        })
        let element = document.createElement('div')
        element.setAttribute("class", "formRow")


        let label = document.createElement('label')
        label.setAttribute('class', 'labelElement')
        label.innerText = (`Element `)

        element.appendChild(label)

        let input = document.createElement('input')
        input.setAttribute('name', 'inputElement')
        input.setAttribute('placeholder', 'edin')
        input.setAttribute('class', 'inputElement')

        element.appendChild(input)

        let select1 = document.createElement('select')
        select1.setAttribute('class', 'select1')
        select1.setAttribute('name', 'select1')
        dropdown1.forEach(el => {
            let option = document.createElement('option')
            option.innerText = el;
            select1.appendChild(option)
        })
        element.appendChild(select1)
        select1.addEventListener('change', e => {
            radioButtons(e)
        })


        let select2 = document.createElement('select')
        select2.setAttribute('class', 'select2')
        select2.setAttribute('name', 'select2')
        dropdown2.forEach(el => {
            let option = document.createElement('option')
            option.innerText = el;
            select2.appendChild(option)
        })
        element.appendChild(select2)





        let removeButton = document.createElement('button')
        removeButton.addEventListener('click', e => {
            e.preventDefault()
            if (countTemplateRows(e) > 1) {

                e.target.parentNode.remove()

            }

        })
        removeButton.innerText = '-'
        removeButton.setAttribute('class', 'removeButton')
        element.appendChild(removeButton)




        if (element.nextElementSibling == null) {
            let addButton = document.createElement('button')
            addButton.setAttribute('class', 'addButton')
            addButton.innerText = '+'
            addButton.addEventListener('click', e => {
                e.preventDefault()

                addRow(e);
            })
            element.appendChild(addButton)

        }
        formTemplate.appendChild(element)



        let saveButtonDiv = document.createElement('div')
        saveButtonDiv.setAttribute('id', 'saveButtonDiv')
        let saveButton = document.createElement('button')
        saveButton.setAttribute('id', 'saveButton')
        saveButton.setAttribute('type', 'submit')

        saveButton.innerText = 'Save Formular Template'
        saveButtonDiv.appendChild(saveButton)

        formTemplate.appendChild(saveButtonDiv)


        document.body.appendChild(formTemplate)

    }

    if (templateName == "") {
        if (search == 0) {
            search++
            let forma = document.querySelector('.formTemplate')
            if (forma) { forma.remove() }
            formMaker(templateName)
        }
    } else {
        let forma = document.querySelector('.formTemplate')
        if (forma) { forma.remove() }
        search = 0
        formMaker(templateName)
    }



}


function addRow(e) {
    let formTemplate = e.target.parentNode.parentNode

    e.target.remove()
    let element = document.createElement('div')
    element.setAttribute("class", "formRow")


    let label = document.createElement('label')
    label.innerText = (`Element `)
    label.setAttribute('class', 'labelElement')
    element.appendChild(label)

    let input = document.createElement('input')
    input.setAttribute('placeholder', 'edin')
    input.setAttribute('class', 'inputElement')
    input.setAttribute('name', 'inputElement')

    element.appendChild(input)

    let select1 = document.createElement('select')
    select1.setAttribute('class', 'select1')
    select1.setAttribute('name', 'select1')
    dropdown1.forEach(el => {
        let option = document.createElement('option')
        option.innerText = el;
        select1.appendChild(option)
    })
    element.appendChild(select1)
    select1.addEventListener('change', e => {
        radioButtons(e)
    })


    let select2 = document.createElement('select')
    select2.setAttribute('class', 'select2')
    select2.setAttribute('name', 'select2')
    dropdown2.forEach(el => {
        let option = document.createElement('option')
        option.innerText = el;
        select2.appendChild(option)
    })
    element.appendChild(select2)





    let removeButton = document.createElement('button')
    removeButton.setAttribute('class', 'removeButton')
    removeButton.addEventListener('click', e => {
        e.preventDefault()

        if (countTemplateRows(e) > 1) {

            if (e.target.parentNode.nextElementSibling == null) {

                let addButton = document.createElement('button')
                addButton.innerText = '+'
                addButton.addEventListener('click', e => {
                    e.preventDefault()

                    addRow(e);
                })
                e.target.parentNode.previousElementSibling.appendChild(addButton)
            }
            e.target.parentNode.remove()





        }
    })
    removeButton.innerText = '-'
    element.appendChild(removeButton)

    if (element.nextElementSibling == null) {
        let addButton = document.createElement('button')
        addButton.innerText = '+'
        addButton.addEventListener('click', e => {
            e.preventDefault()

            addRow(e);
        })
        element.appendChild(addButton)

    }

    formTemplate.appendChild(element)
}

function radioButtons(e) {

    if (e.target.value == "radio button") {

        let radioButtonsArea = document.createElement('div')
        radioButtonsArea.setAttribute('class', 'radioButtonsArea')

        let radioButtonDivPrimary = document.createElement('div')
        radioButtonDivPrimary.setAttribute('class', 'radioButtonDiv')
        let radioButtonDivSecondary = document.createElement('div')
        radioButtonDivSecondary.setAttribute('class', 'radioButtonDiv')

        let primaryInputArea = document.createElement('input')
        primaryInputArea.setAttribute('class', 'insideField')
        let primaryRadioButton = document.createElement('button')
        primaryRadioButton.setAttribute('class', 'radioButton')
        primaryRadioButton.innerText = '-'
        primaryRadioButton.addEventListener('click', e => {
            removeRadioButton(e)
        })

        let addRadioButton = document.createElement('button')
        addRadioButton.innerText = '+'
        addRadioButton.setAttribute('class', 'radioButton')
        addRadioButton.addEventListener('click', e => {
            addNewRadioButton(e)
        })


        radioButtonDivPrimary.appendChild(primaryInputArea)
        radioButtonDivPrimary.appendChild(primaryRadioButton)


        let secondaryInputArea = document.createElement('input')
        secondaryInputArea.setAttribute('class', 'insideField')
        let secondaryRadioButton = document.createElement('button')
        secondaryRadioButton.setAttribute('class', 'radioButton')
        secondaryRadioButton.innerText = '-'
        secondaryRadioButton.addEventListener('click', e => {
            removeRadioButton(e)
        })

        radioButtonDivSecondary.appendChild(secondaryInputArea)
        radioButtonDivSecondary.appendChild(secondaryRadioButton)
        radioButtonDivSecondary.appendChild(addRadioButton)

        radioButtonsArea.appendChild(radioButtonDivPrimary)
        radioButtonsArea.appendChild(radioButtonDivSecondary)

        e.target.parentNode.appendChild(radioButtonsArea)



    } else {
        if (e.target.parentNode.lastElementChild.getAttribute('class') == "radioButtonsArea")

            e.target.parentNode.lastElementChild.remove()
    }


}


function countTemplateRows(e) {
    let rows = document.querySelectorAll('.formRow')

    let count = rows.length


    return count
}

function removeRadioButton(e) {
    e.preventDefault()

    let radioButtonsArea = e.target.closest('.radioButtonsArea')
    let length = radioButtonsArea.childNodes.length
    if (length > 2) {
        if (e.target.nextElementSibling != null) {
            let addRadioButton = document.createElement('button')
            addRadioButton.innerText = '+'
            addRadioButton.setAttribute('class', 'radioButton')
            addRadioButton.addEventListener('click', e => {
                addNewRadioButton(e)
            })
            e.target.parentNode.previousSibling.appendChild(addRadioButton)


        }

        e.target.parentNode.remove();
    } else {
        alert('There must be at least 2 radio buttons')
    }

}

function addNewRadioButton(e) {
    e.preventDefault()



    let radioButtonDiv = document.createElement('div')
    radioButtonDiv.setAttribute('class', 'radioButtonDiv')

    let inputArea = document.createElement('input')
    inputArea.setAttribute('class', 'insideField')
    let deleteRadioButton = document.createElement('button')
    deleteRadioButton.setAttribute('class', 'radioButton')
    deleteRadioButton.innerText = '-'
    deleteRadioButton.addEventListener('click', e => {
        removeRadioButton(e)
    })

    let addRadioButton = document.createElement('button')
    addRadioButton.innerText = '+'
    addRadioButton.setAttribute('class', 'radioButton')
    addRadioButton.addEventListener('click', e => {
        addNewRadioButton(e)
    })

    radioButtonDiv.appendChild(inputArea)
    radioButtonDiv.appendChild(deleteRadioButton)
    radioButtonDiv.appendChild(addRadioButton)

    e.target.parentNode.parentNode.appendChild(radioButtonDiv)

    e.target.remove()
}


function makeFormular(form) {
    let name = document.querySelector('.searchInput').value
    if (name == "") {
        alert('molim vas unesite ime forme')
    } else {

        let alertMe = false


        let data = [{}]
        let formRows = form.querySelectorAll('.formRow')
        let forma = {}
        forma['formName'] = name

        formRows.forEach(e => {

            let object = {}
            let input = e.querySelector('.inputElement')
            if (input.value == "") {
                alert('Izostavili ste naziv za label')
                alertMe = true
                return
            }
            let select1 = e.querySelector('.select1')
            object[input.name] = input.value
            object[select1.name] = select1.options[select1.selectedIndex].innerText
            if (select1.options[select1.selectedIndex].innerText == 'radio button') {
                let values = []
                let insideFields = e.querySelectorAll('.insideField')
                insideFields.forEach(field => {
                    values.push(field.value)
                })
                object['radio buttons'] = values


            }
            let select2 = e.querySelector('.select2')
            object[select2.name] = select2.options[select2.selectedIndex].innerText
            data.push(object)

        }
        )
        if (alertMe == true) { return }
        data.shift()
        console.log(data)

        forma['data'] = data;




        insertFormTemplate(forma)
        makeStore(name)





    }
}


function showForm(templateData) {

    let forma = document.querySelector('.formTemplate')
    if (forma) { forma.remove() }

    let formTemplate = document.createElement('form')
    formTemplate.setAttribute('class', 'formTemplate')
    formTemplate.addEventListener('submit', e => {
        e.preventDefault()
        updateFormular(e.target)
    })

    let data = templateData.data
    data.forEach((el) => {
        let element = document.createElement('div')
        element.setAttribute('class', 'formRow')

        let label = document.createElement('label')
        label.setAttribute('class', 'labelElement')
        label.innerText = 'Element'

        element.appendChild(label);

        let input = document.createElement('input')
        input.setAttribute('name', 'inputElement')
        input.setAttribute('class', 'inputElement')
        input.setAttribute('placeholder', `${el.inputElement}`)
        input.value = el.inputElement
        element.appendChild(input)

        let select1 = document.createElement('select')
        select1.setAttribute('class', 'select1')
        select1.setAttribute('name', 'select1')
        dropdown1.forEach(opt => {
            let option = document.createElement('option')
            option.innerText = opt;
            select1.appendChild(option)
        })

        select1.value = el.select1
        select1.addEventListener('change', e => {
            appendInsideFields(e, el)
        })
        element.appendChild(select1)
        if (el.select1 == "radio button") {
            let radioButtonsArea = document.createElement('div')
            radioButtonsArea.setAttribute('class', 'radioButtonsArea')
            el['radio buttons'].forEach((inputField) => {
                showRadioButtonsFields(radioButtonsArea, inputField, element)

            })
            attachAddButton(element)
        }
        let select2 = document.createElement('select')
        select2.setAttribute('class', 'select2')
        select2.setAttribute('name', 'select2')
        dropdown2.forEach(opt => {
            let option = document.createElement('option')
            option.innerText = opt;
            select2.appendChild(option)
        })
        select2.value = el.select2
        element.appendChild(select2)


        let removeButton = document.createElement('button')
        removeButton.addEventListener('click', e => {
            e.preventDefault()
            if (countTemplateRows(e) > 1) {
                let addButton = e.target.nextElementSibling
                if (addButton) {
                    if (addButton.getAttribute('class') == 'addButton') {
                        let addButton = document.createElement('button')
                        addButton.setAttribute('class', 'addButton')
                        addButton.innerText = '+'
                        addButton.addEventListener('click', e => {
                            e.preventDefault()
                            addNewRow(e)
                        })
                        e.target.parentNode.previousElementSibling.appendChild(addButton)
                    }



                }
                e.target.parentNode.remove()
            }
        })
        removeButton.innerText = '-'
        removeButton.setAttribute('class', 'removeButton')
        element.appendChild(removeButton)



        let saveButtonDiv = document.createElement('div')
        saveButtonDiv.setAttribute('id', 'saveButtonDiv')
        let saveButton = document.createElement('button')
        saveButton.setAttribute('id', 'saveButton')
        saveButton.setAttribute('type', 'submit')

        saveButton.innerText = 'Save Formular Template'
        saveButtonDiv.appendChild(saveButton)

        formTemplate.appendChild(saveButtonDiv)




        formTemplate.appendChild(element)


    })

    document.body.appendChild(formTemplate)
    addNewRowButton(formTemplate)
}


function updateFormular(form) {
    let name = document.querySelector('.searchInput').value
    let alertMe = false
    let data = [{}]
    let formRows = form.querySelectorAll('.formRow')
    let forma = {}
    forma['formName'] = name

    formRows.forEach(e => {

        let object = {}
        let input = e.querySelector('.inputElement')
        if (input.value == "") {
            alert('Izostavili ste naziv za label')
            alertMe = true
            return
        }
        let select1 = e.querySelector('.select1')
        object[input.name] = input.value
        object[select1.name] = select1.options[select1.selectedIndex].innerText
        if (select1.options[select1.selectedIndex].innerText == 'radio button') {
            let values = []
            let insideFields = e.querySelectorAll('.insideField')
            insideFields.forEach(field => {
                values.push(field.value)
            })
            object['radio buttons'] = values


        }
        let select2 = e.querySelector('.select2')
        object[select2.name] = select2.options[select2.selectedIndex].innerText
        data.push(object)

    }
    )
    if (alertMe == true) {
        alertMe = false
        return
    }
    data.shift()

    forma['data'] = data;
    console.log(forma)

    putFormular(forma)
}
function addNewRowButton(formTemplate) {
    let formRow = formTemplate.children[formTemplate.children.length - 1]

    let addButton = document.createElement('button')
    addButton.setAttribute('class', 'addButton')
    addButton.innerText = '+'
    addButton.addEventListener('click', e => {
        e.preventDefault()
        addNewRow(e)
    })
    formRow.appendChild(addButton)
}

function addNewRow(e) {
    let formTemplate = e.target.parentNode.parentNode

    e.target.remove()
    let element = document.createElement('div')
    element.setAttribute("class", "formRow")


    let label = document.createElement('label')
    label.innerText = (`Element `)
    label.setAttribute('class', 'labelElement')
    element.appendChild(label)

    let input = document.createElement('input')
    input.setAttribute('placeholder', 'edin')
    input.setAttribute('class', 'inputElement')
    input.setAttribute('name', 'inputElement')

    element.appendChild(input)

    let select1 = document.createElement('select')
    select1.setAttribute('class', 'select1')
    select1.setAttribute('name', 'select1')
    dropdown1.forEach(el => {
        let option = document.createElement('option')
        option.innerText = el;
        select1.appendChild(option)
    })
    element.appendChild(select1)
    select1.addEventListener('change', e => {
        radioButtons(e)
    })


    let select2 = document.createElement('select')
    select2.setAttribute('class', 'select2')
    select2.setAttribute('name', 'select2')
    dropdown2.forEach(el => {
        let option = document.createElement('option')
        option.innerText = el;
        select2.appendChild(option)
    })
    element.appendChild(select2)





    let removeButton = document.createElement('button')
    removeButton.setAttribute('class', 'removeButton')
    removeButton.addEventListener('click', e => {
        e.preventDefault()

        if (countTemplateRows(e) > 1) {

            if (e.target.parentNode.nextElementSibling == null) {

                let addButton = document.createElement('button')
                addButton.innerText = '+'
                addButton.addEventListener('click', e => {
                    e.preventDefault()

                    addNewRow(e);
                })
                e.target.parentNode.previousElementSibling.appendChild(addButton)
            }
            e.target.parentNode.remove()





        }
    })
    removeButton.innerText = '-'
    element.appendChild(removeButton)

    if (element.nextElementSibling == null) {
        let addButton = document.createElement('button')
        addButton.innerText = '+'
        addButton.addEventListener('click', e => {
            e.preventDefault()

            addRow(e);
        })
        element.appendChild(addButton)

    }

    formTemplate.appendChild(element)
}


function attachAddButton(element) {
    let children = element.children

    let addRadioButton = document.createElement('button')
    addRadioButton.innerText = '+'
    addRadioButton.setAttribute('class', 'radioButton')
    addRadioButton.addEventListener('click', e => {
        addNewRadioButton(e)
    })
    let lastChild = children[children.length - 1].children.length
    children[children.length - 1].children[lastChild - 1].appendChild(addRadioButton)



}




function showRadioButtonsFields(radioButtonsArea, inputField, element) {




    let radioButtonDivPrimary = document.createElement('div')
    radioButtonDivPrimary.setAttribute('class', 'radioButtonDiv')

    let primaryInputArea = document.createElement('input')
    primaryInputArea.setAttribute('class', 'insideField')
    primaryInputArea.value = inputField
    let primaryRadioButton = document.createElement('button')
    primaryRadioButton.setAttribute('class', 'radioButton')
    primaryRadioButton.innerText = '-'
    primaryRadioButton.addEventListener('click', e => {
        removeRadioButton(e)
    })

    let addRadioButton = document.createElement('button')
    addRadioButton.innerText = '+'
    addRadioButton.setAttribute('class', 'radioButton')
    addRadioButton.addEventListener('click', e => {
        addNewRadioButton(e)
    })






    radioButtonDivPrimary.appendChild(primaryInputArea)
    radioButtonDivPrimary.appendChild(primaryRadioButton)
    radioButtonsArea.appendChild(radioButtonDivPrimary)


    element.appendChild(radioButtonsArea)

}

function appendInsideFields(event, el) {


    if (event.target.value == "radio button") {
        let radioButtonsArea = document.createElement('div')
        radioButtonsArea.setAttribute('class', 'radioButtonsArea')
        let element = event.target.closest('.formRow')
        if (el['radio buttons']) {
            el['radio buttons'].forEach((inputField => {
                showRadioButtonsFields(radioButtonsArea, inputField, element)
            }))
            attachAddButton(element)
        } else {
            radioButtons(event)
        }


    } else {
        let radioButtonsArea = event.target.parentNode.querySelector('.radioButtonsArea')
        if (radioButtonsArea) {
            radioButtonsArea.remove()
        }

    }

}

function administrationTab() {
    let template = document.querySelector('.formTemplate')
    if (template) {
        template.remove()

    }
    let formularSearch = document.querySelector('.formularSearch')

    formularSearch.innerHTML = ""

    let label1 = document.createElement('label')
    label1.innerText = 'Formular name'
    label1.setAttribute('id', 'formularLabel')

    let searchField = document.createElement('input')
    searchField.setAttribute('type', 'text')
    searchField.setAttribute('class', 'searchInput')
    searchField.setAttribute('placeholder', 'some formular')

    let searchButton = document.createElement('button')
    searchButton.setAttribute('class', 'searchButton')
    searchButton.innerText = 'Search'
    searchButton.addEventListener('click', e => {
        e.preventDefault()
        displayForm()

    })

    formularSearch.appendChild(label1)
    formularSearch.appendChild(searchField)
    formularSearch.appendChild(searchButton)
}



function formularTab() {
    let formularSearch = document.querySelector('.formularSearch')

    let formTemplate = document.querySelector('.formTemplate')
    if (formTemplate) {
        formTemplate.remove()
        search = 0
    }

    formularSearch.innerHTML = ""

    let label1 = document.createElement('label')
    label1.innerText = 'Formular name'
    label1.setAttribute('id', 'formularLabel')

    let searchField = document.createElement('input')
    searchField.setAttribute('type', 'text')
    searchField.setAttribute('class', 'searchInput')
    searchField.setAttribute('placeholder', 'some formular')






    let dataId = document.createElement('label')
    dataId.innerText = 'Data id'
    dataId.setAttribute('class', 'dataId')

    let id = document.createElement('input')
    id.setAttribute('class', 'id')
    id.setAttribute('placeholder', '0')
    let loadBtn = document.createElement('button')
    loadBtn.innerText = 'Load Data'
    loadBtn.addEventListener('click', e => {
        e.preventDefault()
        checkData()
    })

    let newBtn = document.createElement('button')
    newBtn.innerText = 'New Data'
    newBtn.addEventListener('click', e => {
        e.preventDefault()
        addNewData()
    })


    formularSearch.appendChild(label1)
    formularSearch.appendChild(searchField)


    formularSearch.appendChild(dataId)
    formularSearch.appendChild(id)
    formularSearch.appendChild(loadBtn)
    formularSearch.appendChild(newBtn)
}

function addNewData() {
    let formName = document.querySelector('.searchInput').value
    getTemplate(formName).then(result => {
        if (typeof (result) == 'undefined') {
            alert('Forma ne postoji')
        }
        else {
            makeNewData(result)
        }
    })

}

function loadData(data) {
    let formName = document.querySelector('.searchInput').value
    getTemplate(formName).then(result => {
        if (typeof (result) == 'undefined') {
            alert('Forma ne postoji')
        }
        else {
            loadNewData(result, data)
        }
    })



}

function loadNewData(form, displayData) {
    let template = document.querySelector('.formTemplate')
    if (template) {
        template.remove()

    }
    //if (counter == 0) {
    let formTemplate = document.createElement('form')
    formTemplate.setAttribute('class', 'formTemplate')
    let searchInput = document.querySelector('.searchInput').value
    formTemplate.addEventListener('submit', e => {
        e.preventDefault();
        updateNewData(e.target, searchInput)
    })

    let radioButtonCounter = 0
    form.data.forEach((element) => {
        let formRow = document.createElement('div')
        formRow.setAttribute('class', 'mainRow')

        let label = document.createElement('label')
        label.setAttribute('class', 'labelElement')
        label.innerText = element.inputElement

        formRow.appendChild(label)

        let Row = document.createElement('div')
        Row.setAttribute('class', 'Row')

        if (element.select1 == 'radio button') {
            element['radio buttons'].forEach((el) => {
                //let radioButtonArea = document.createElement('div')

                let b = document.createElement('div')
                b.setAttribute('class', 'b')
                let input = document.createElement('input')
                input.setAttribute('type', 'radio')
                input.setAttribute('name', `radioButtons${radioButtonCounter}`)
                input.setAttribute('class', 'radioButtonGroup')

                let label = document.createElement('label')
                label.innerText = el
                label.setAttribute('class', 'radioButtonLabel')
                label.setAttribute('for', `radioButtonGroup`)
                // radioButtonArea.appendChild(input)
                // radioButtonArea.appendChild(label)

                b.appendChild(input)
                b.appendChild(label)

                Row.appendChild(b)

                //   Row.appendChild(input)
                //   Row.appendChild(label)

            })
            radioButtonCounter++
            formRow.appendChild(Row)

        } else if (element.select1 == 'textbox') {
            let input = document.createElement('input')
            input.setAttribute('type', 'text')
            Row.appendChild(input)
            formRow.appendChild(Row)
        } else if (element.select1 == 'checkbox') {
            let input = document.createElement('input')
            input.setAttribute('type', 'checkbox')
            Row.appendChild(input)
            formRow.appendChild(Row)
        }





        formTemplate.appendChild(formRow)
        if (element.select2 == 'mandatory') {
            let input = formRow.querySelector('input')
            input.required = 'true'
            let label = formRow.querySelector('.labelElement')
            label.classList.add('required')
        } else if (element.select2 == 'numeric') {
            let input = formRow.querySelector('input')
            input.setAttribute('type', 'number')
            input.setAttribute('min', '0')
        }

    })
    let saveDiv = document.createElement('div')

    let saveButton = document.createElement('button')
    saveButton.setAttribute('class', 'saveNewData')
    saveButton.innerText = 'Save Data'

    saveButton.setAttribute('type', 'submit')
    saveDiv.appendChild(saveButton)
    formTemplate.appendChild(saveDiv)
    document.body.appendChild(formTemplate)
    counter++
    //mogao si samo ubaciti drugaciji event listener debiluuu al aj

    // e sad da popuni
    console.log(displayData)

    let labels = document.querySelectorAll('.labelElement')

    labels.forEach(el => {
        let input = el.nextElementSibling.querySelector('input')

        if (displayData.hasOwnProperty(el.innerText)) {
            if (input.type == 'text' || input.type == 'number') {
                input.value = displayData[el.innerText]
            } else if (input.type == 'checkbox') {
                input.checked = displayData[el.innerText]
            } else if (input.type == 'radio') {
                let row = input.parentNode.parentNode
                let radioLabels = row.querySelectorAll('.radioButtonLabel')
                radioLabels.forEach(radioLabel => {
                    if (radioLabel.innerText == displayData[el.innerText]) {
                        radioLabel.previousElementSibling.checked = true
                    }
                })
            }
        }
    })

}

function updateNewData(form, name) {
    let data = {}
    let id = document.querySelector('.id').value
    let rows = form.querySelectorAll('.mainRow')

    rows.forEach(row => {
        let input = row.querySelector('input')
        let label = row.querySelector('label')



        if (input.type == "checkbox") {



            data[label.innerText] = input.checked

        } else if (input.type == "radio") {
            let radioButtons = row.querySelectorAll('.radioButtonGroup')
            radioButtons.forEach(button => {
                if (button.checked) {
                    let value = button.nextElementSibling.innerText
                    data[label.innerText] = value
                }
            })

        } else {
            data[label.innerText] = input.value
        }






    })

    updateData(data, name, id);
    alert('uspjesno sacuvano')

    form.remove()
}


async function checkData() {
    let id = document.querySelector('.id').value
    id = parseInt(id)

    let template = document.querySelector('.formTemplate')
    if (template) {
        template.remove()

    }
    let searchInput = document.querySelector('.searchInput').value
    let data = null
    if (db) {

        try {
            const tx = await db.transaction(searchInput, 'readonly')
            const store = await tx.objectStore(searchInput)
            tx.onerror = () => {
                console.log("problem with transaction")
            }

            tx.oncomplete = () => {
                console.log('transaction good')
            }

            let request = store.get(id)
            request.onerror = function (event) {
                console.log('could not get')
            }
            request.onsuccess = function () {
                console.log('successfully retrieved')
                data = request.result

                if (data != null) {
                    loadData(data)
                }
                //zasto ne radi ako prethodni if nije u ovom try bloku?
            }
        } catch {
            alert('Ne postoji')
        }




    }


}


function makeNewData(form) {
    let template = document.querySelector('.formTemplate')
    if (template) {
        template.remove()

    }
    //if (counter == 0) {
    let formTemplate = document.createElement('form')
    formTemplate.setAttribute('class', 'formTemplate')
    let searchInput = document.querySelector('.searchInput').value
    formTemplate.addEventListener('submit', e => {
        e.preventDefault();
        saveNewData(e.target, searchInput)
    })

    let radioButtonCounter = 0
    form.data.forEach((element) => {
        let formRow = document.createElement('div')
        formRow.setAttribute('class', 'mainRow')

        let label = document.createElement('label')
        label.setAttribute('class', 'labelElement')
        label.innerText = element.inputElement

        formRow.appendChild(label)

        let Row = document.createElement('div')
        Row.setAttribute('class', 'Row')

        if (element.select1 == 'radio button') {
            element['radio buttons'].forEach((el) => {
                //let radioButtonArea = document.createElement('div')

                let b = document.createElement('div')
                b.setAttribute('class', 'b')
                let input = document.createElement('input')
                input.setAttribute('type', 'radio')
                input.setAttribute('name', `radioButtons${radioButtonCounter}`)
                input.setAttribute('class', 'radioButtonGroup')

                let label = document.createElement('label')
                label.innerText = el
                label.setAttribute('class', 'radioButtonLabel')
                label.setAttribute('for', `radioButtonGroup`)
                // radioButtonArea.appendChild(input)
                // radioButtonArea.appendChild(label)

                b.appendChild(input)
                b.appendChild(label)

                Row.appendChild(b)

                //   Row.appendChild(input)
                //   Row.appendChild(label)

            })
            radioButtonCounter++
            formRow.appendChild(Row)

        } else if (element.select1 == 'textbox') {
            let input = document.createElement('input')
            input.setAttribute('type', 'text')
            Row.appendChild(input)
            formRow.appendChild(Row)
        } else if (element.select1 == 'checkbox') {
            let input = document.createElement('input')
            input.setAttribute('type', 'checkbox')
            Row.appendChild(input)
            formRow.appendChild(Row)
        }





        formTemplate.appendChild(formRow)
        if (element.select2 == 'mandatory') {
            let input = formRow.querySelector('input')
            input.required = 'true'
            let label = formRow.querySelector('.labelElement')
            label.classList.add('required')
        } else if (element.select2 == 'numeric') {
            let input = formRow.querySelector('input')
            input.setAttribute('type', 'number')
            input.setAttribute('min', '0')
        }

    })
    let saveDiv = document.createElement('div')

    let saveButton = document.createElement('button')
    saveButton.setAttribute('class', 'saveNewData')
    saveButton.innerText = 'Save Data'

    saveButton.setAttribute('type', 'submit')
    saveDiv.appendChild(saveButton)
    formTemplate.appendChild(saveDiv)
    document.body.appendChild(formTemplate)
    counter++
    // }
}

function saveNewData(form, name) {
    let data = {}

    let rows = form.querySelectorAll('.mainRow')

    rows.forEach(row => {
        let input = row.querySelector('input')
        let label = row.querySelector('label')



        if (input.type == "checkbox") {



            data[label.innerText] = input.checked

        } else if (input.type == "radio") {
            let radioButtons = row.querySelectorAll('.radioButtonGroup')
            radioButtons.forEach(button => {
                if (button.checked) {
                    let value = button.nextElementSibling.innerText
                    data[label.innerText] = value
                }
            })

        } else {
            data[label.innerText] = input.value
        }






    })

    insertData(data, name);
    alert('uspjesno sacuvano')

    form.remove()
}