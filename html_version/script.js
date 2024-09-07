const slots = document.querySelectorAll('.pedalboard-slot');
const pedals = document.querySelectorAll('.pedal');
const pedalOrderList = document.getElementById('pedalOrderList');
const topBar = document.getElementById('top-bar');
const totalsList = document.getElementById('totalsList');

// Array to track pedal placement in each slot (index 0 = slot 8, index 7 = slot 1)
const pedalOrder = Array(8).fill(null); // Initialize an empty array with 8 elements (for slots 8-1)

// Add event listeners for drag-and-drop functionality
pedals.forEach(pedal => {
    pedal.addEventListener('dragstart', dragStart);
});

slots.forEach(slot => {
    slot.addEventListener('dragover', dragOver);
    slot.addEventListener('drop', drop);
});

topBar.addEventListener('dragover', dragOver);
topBar.addEventListener('drop', dropBackToTopBar);

function dragStart(e) {
    e.dataTransfer.setData('text', e.target.id);
    setTimeout(() => {
        e.target.classList.add('hide');
    }, 0);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const pedalId = e.dataTransfer.getData('text');
    const pedalElement = document.getElementById(pedalId);
    const slotNumber = parseInt(e.target.id.replace('slot', ''), 10);

    // Clear the pedal from its previous slot if already placed
    const previousSlot = pedalOrder.findIndex(id => id === pedalId);
    if (previousSlot !== -1) {
        pedalOrder[previousSlot] = null; // Remove from previous slot
    }

    // Append the dragged pedal to the slot
    if (e.target.classList.contains('pedalboard-slot')) {
        pedalElement.classList.remove('hide');
        e.target.appendChild(pedalElement);

        // Update the pedalOrder array based on the slot's ID
        pedalOrder[8 - slotNumber] = pedalId; // Store pedal in reverse order

        // Update the dynamic list of pedals
        updatePedalOrderList();
        updateTotalsList();
    }
}

function dropBackToTopBar(e) {
    e.preventDefault();
    const pedalId = e.dataTransfer.getData('text');
    const pedalElement = document.getElementById(pedalId);

    // Remove pedal from the board and re-add it to the top bar
    const previousSlot = pedalOrder.findIndex(id => id === pedalId);
    if (previousSlot !== -1) {
        pedalOrder[previousSlot] = null; // Remove from previous slot
        updatePedalOrderList();
        updateTotalsList();
    }

    pedalElement.classList.remove('hide');
    topBar.appendChild(pedalElement);
}

function updatePedalOrderList() {
    // Clear the previous list
    pedalOrderList.innerHTML = '';

    // Filter out empty slots and generate the list in reverse order (8-1)
    pedalOrder.forEach(pedalId => {
        if (pedalId) {
            const listItem = document.createElement('li');
            listItem.textContent = document.getElementById(pedalId).textContent;
            pedalOrderList.appendChild(listItem);
        }
    });
}

function calculateTotalmA() {
    // Gather the total current draw of all pedals from the current list
    let totalCurrent = 0;
    pedalOrder.forEach(pedalId => {
        if (pedalId) {
            const pedalElement = document.getElementById(pedalId);
            const currentText = pedalElement.querySelector('.tooltip').textContent;
            const currentMatch = currentText.match(/Current: (\d+) mA/);
            if (currentMatch) {
                totalCurrent += parseInt(currentMatch[1], 10);
            }
        }
    });
    console.log(totalCurrent);
    return totalCurrent;
}

function calculateTotalPower() {
    // Gather the total power draw of all pedals from the current list
    let totalPower = 0;
    pedalOrder.forEach(pedalId => {
        if (pedalId) {
            const pedalElement = document.getElementById(pedalId);
            const powerText = pedalElement.querySelector('.tooltip').textContent;
            const powerMatch = powerText.match(/Power: (\d+)V DC/);
            if (powerMatch) {
                totalPower += parseInt(powerMatch[1], 10);
            }
        }
    });
    console.log(totalPower);
    return totalPower;
}

function updateTotalsList() {
    // Clear the previous list
    totalsList.innerHTML = '';

    // Calculate the total mA and power draw of all pedals
    const totalCurrent = calculateTotalmA();
    const totalPower = calculateTotalPower();
    console.log(totalCurrent);
    console.log(totalPower);

    // Create list items for the totals
    const currentListItem = document.createElement('li');
    currentListItem.textContent = `Total Current Draw: ${totalCurrent} mA`;
    totalsList.appendChild(currentListItem);

    const powerListItem = document.createElement('li');
    powerListItem.textContent = `Total Power Draw: ${totalPower}V DC`;
    totalsList.appendChild(powerListItem);
}