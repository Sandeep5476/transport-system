document.addEventListener('DOMContentLoaded', function() {

    // --- DOM Element Variables ---
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const modal = document.getElementById('detailsModal');
    const addDetailsBtn = document.getElementById('addDetailsBtn');
    const closeModalBtn = document.querySelector('.close-button');
    const detailsForm = document.getElementById('detailsForm');
    const dashboardCards = document.querySelectorAll('.card');

    // --- Navigation Logic ---
    function showSection(targetId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(targetId).classList.add('active');

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.target === targetId) {
                link.classList.add('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.target;
            showSection(targetId);
        });
    });
    
    dashboardCards.forEach(card => {
        card.addEventListener('click', () => {
             const targetId = card.dataset.target;
             showSection(targetId);
        });
    });


    // --- Modal Logic ---
    addDetailsBtn.addEventListener('click', () => {
        // Pre-fill modal with existing values if available
        const savedDetails = JSON.parse(localStorage.getItem('studentDetails') || '{}');
        document.getElementById('rollNo').value = savedDetails.rollNo || '';
        document.getElementById('parentName').value = savedDetails.parentName || '';
        document.getElementById('parentPhone').value = savedDetails.parentPhone || '';
        document.getElementById('collegeDetails').value = savedDetails.collegeDetails || '';
        document.getElementById('busNumber').value = savedDetails.busNumber || '';
        document.getElementById('busRouteCity').value = savedDetails.busRouteCity || '';
        document.getElementById('startPoint').value = savedDetails.startPoint || '';
        document.getElementById('intermediateStops').value = savedDetails.intermediateStops ? savedDetails.intermediateStops.join(', ') : '';
        document.getElementById('endPoint').value = savedDetails.endPoint || '';
        document.getElementById('driverDetails').value = savedDetails.driverDetails || '';
        modal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    // --- Form Submission & Data Handling ---
    detailsForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent actual form submission

        // 1. Get data from form fields
        const rollNo = document.getElementById('rollNo').value;
        const parentName = document.getElementById('parentName').value;
        const parentPhone = document.getElementById('parentPhone').value;
        const collegeDetails = document.getElementById('collegeDetails').value;
        const busNumber = document.getElementById('busNumber').value;
        const busRouteCity = document.getElementById('busRouteCity').value;
        const startPoint = document.getElementById('startPoint').value;
        const intermediateStops = document.getElementById('intermediateStops').value.split(',').map(s => s.trim()).filter(s => s);
        const endPoint = document.getElementById('endPoint').value;
        const driverDetails = document.getElementById('driverDetails').value;

        // Save details to localStorage
        localStorage.setItem('studentDetails', JSON.stringify({
            rollNo, parentName, parentPhone, collegeDetails, busNumber, busRouteCity, startPoint, intermediateStops, endPoint, driverDetails
        }));

        // 2. Update the 'Profile' section
        document.getElementById('display_roll_no').textContent = rollNo;
        document.getElementById('display_parent_name').textContent = parentName;
        document.getElementById('display_parent_phone').textContent = parentPhone;
        document.getElementById('display_college_details').textContent = collegeDetails;
        document.getElementById('display_driver_details').textContent = driverDetails;

        // 3. Update the 'Bus Route' section
        document.getElementById('display_bus_number').textContent = busNumber;
        document.getElementById('display_bus_route_city').textContent = busRouteCity;
        
        // 4. Build and inject the timeline
        const timelineContainer = document.getElementById('timeline_container');
        timelineContainer.innerHTML = ''; // Clear previous content

        // Add start point
        let startNode = document.createElement('div');
        startNode.className = 'timeline-item start';
        startNode.innerHTML = `<p>${startPoint}</p><span>Starting Point</span>`;
        timelineContainer.appendChild(startNode);
        
        // Add intermediate stops
        intermediateStops.forEach(stop => {
            let itemNode = document.createElement('div');
            itemNode.className = 'timeline-item';
            itemNode.innerHTML = `<p>${stop}</p><span>Intermediate Stop</span>`;
            timelineContainer.appendChild(itemNode);
        });

        // Add end point
        let endNode = document.createElement('div');
        endNode.className = 'timeline-item end';
        endNode.innerHTML = `<p>${endPoint}</p><span>Ending Point</span>`;
        timelineContainer.appendChild(endNode);

        // 5. Close the modal and show the profile
        modal.style.display = 'none';
        showSection('profile'); 
    });

    // On page load, populate fields if data exists
    function populateFromStorage() {
        const savedDetails = JSON.parse(localStorage.getItem('studentDetails') || '{}');
        if (savedDetails.rollNo) document.getElementById('display_roll_no').textContent = savedDetails.rollNo;
        if (savedDetails.parentName) document.getElementById('display_parent_name').textContent = savedDetails.parentName;
        if (savedDetails.parentPhone) document.getElementById('display_parent_phone').textContent = savedDetails.parentPhone;
        if (savedDetails.collegeDetails) document.getElementById('display_college_details').textContent = savedDetails.collegeDetails;
        if (savedDetails.driverDetails) document.getElementById('display_driver_details').textContent = savedDetails.driverDetails;
        if (savedDetails.busNumber) document.getElementById('display_bus_number').textContent = savedDetails.busNumber;
        if (savedDetails.busRouteCity) document.getElementById('display_bus_route_city').textContent = savedDetails.busRouteCity;
        if (savedDetails.startPoint || (savedDetails.intermediateStops && savedDetails.intermediateStops.length) || savedDetails.endPoint) {
            const timelineContainer = document.getElementById('timeline_container');
            timelineContainer.innerHTML = '';
            if (savedDetails.startPoint) {
                let startNode = document.createElement('div');
                startNode.className = 'timeline-item start';
                startNode.innerHTML = `<p>${savedDetails.startPoint}</p><span>Starting Point</span>`;
                timelineContainer.appendChild(startNode);
            }
            if (savedDetails.intermediateStops && savedDetails.intermediateStops.length) {
                savedDetails.intermediateStops.forEach(stop => {
                    let itemNode = document.createElement('div');
                    itemNode.className = 'timeline-item';
                    itemNode.innerHTML = `<p>${stop}</p><span>Intermediate Stop</span>`;
                    timelineContainer.appendChild(itemNode);
                });
            }
            if (savedDetails.endPoint) {
                let endNode = document.createElement('div');
                endNode.className = 'timeline-item end';
                endNode.innerHTML = `<p>${savedDetails.endPoint}</p><span>Ending Point</span>`;
                timelineContainer.appendChild(endNode);
            }
        }
    }
    populateFromStorage();

    // --- Management Details Form Logic ---
    const managementForm = document.getElementById('managementForm');
    const managementDisplay = document.getElementById('managementDisplay');
    if (managementForm) {
        managementForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const managerName = document.getElementById('managerName').value;
            const managerPhone = document.getElementById('managerPhone').value;
            const managerEmail = document.getElementById('managerEmail').value;
            const managerNotes = document.getElementById('managerNotes').value;
            // Save to localStorage
            localStorage.setItem('managementDetails', JSON.stringify({ managerName, managerPhone, managerEmail, managerNotes }));
            // Display
            document.getElementById('display_manager_name').textContent = managerName;
            document.getElementById('display_manager_phone').textContent = managerPhone;
            document.getElementById('display_manager_email').textContent = managerEmail;
            document.getElementById('display_manager_notes').textContent = managerNotes;
            managementDisplay.style.display = 'block';
        });
        // On load, populate if exists
        const savedManagement = JSON.parse(localStorage.getItem('managementDetails') || '{}');
        if (savedManagement.managerName) document.getElementById('managerName').value = savedManagement.managerName;
        if (savedManagement.managerPhone) document.getElementById('managerPhone').value = savedManagement.managerPhone;
        if (savedManagement.managerEmail) document.getElementById('managerEmail').value = savedManagement.managerEmail;
        if (savedManagement.managerNotes) document.getElementById('managerNotes').value = savedManagement.managerNotes;
        if (savedManagement.managerName || savedManagement.managerPhone || savedManagement.managerEmail || savedManagement.managerNotes) {
            document.getElementById('display_manager_name').textContent = savedManagement.managerName || '';
            document.getElementById('display_manager_phone').textContent = savedManagement.managerPhone || '';
            document.getElementById('display_manager_email').textContent = savedManagement.managerEmail || '';
            document.getElementById('display_manager_notes').textContent = savedManagement.managerNotes || '';
            managementDisplay.style.display = 'block';
        }
    }

    // --- Attendance Log Logic ---
    const attendanceTableBody = document.getElementById('attendanceTableBody');
    if (attendanceTableBody) {
        // Get today's date in readable format
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const todayStr = today.toLocaleDateString('en-US', options);
        // Get attendance from localStorage or set today's as present
        let attendance = JSON.parse(localStorage.getItem('attendanceLog') || '[]');
        if (!attendance.length || attendance[0].date !== todayStr) {
            attendance.unshift({ date: todayStr, status: 'Present' });
            localStorage.setItem('attendanceLog', JSON.stringify(attendance));
        }
        // Show up to 10 most recent
        attendance.slice(0, 10).forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${row.date}</td><td>${row.status}</td>`;
            attendanceTableBody.appendChild(tr);
        });
    }
});
