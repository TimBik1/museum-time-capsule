
function fetchDepartments() {
    fetch('https://collectionapi.metmuseum.org/public/collection/v1/departments')
    .then(response => response.json())
    .then(data => {
        const departmentSelect = document.getElementById('department');
        departmentSelect.innerHTML = '<option value="">--Please choose an option--</option>';
        data.departments.forEach(department => {
            const option = document.createElement('option');
            option.value = department.departmentId;
            option.textContent = department.displayName;
            departmentSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching departments:', error);
    });
}


function fetchArtworksByDepartment(departmentId) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = ''; 

    //objects for the selected department
    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${departmentId}`)
    .then(response => response.json())
    .then(data => {
        if (data.objectIDs && data.objectIDs.length > 0) {
            const objects = data.objectIDs.slice(0, 10);
            objects.forEach(objectID => {
                fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`)
                .then(response => response.json())
                .then(objectData => {
                    if (objectData.primaryImage) {
                        contentDiv.innerHTML += `
                            <div class="artwork">
                                <h2>${objectData.title}</h2>
                                <img src="${objectData.primaryImageSmall}" alt="${objectData.title}" />
                                <p>${objectData.artistDisplayName}</p>
                            </div>
                        `;
                    }
                });
            });
        } else {
            contentDiv.innerHTML = '<p>No artworks found for the selected department.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching artworks:', error);
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Populate departments on page load
    fetchDepartments();
});

// Explore button
document.getElementById('exploreButton').addEventListener('click', function() {
    const departmentSelect = document.getElementById('department');
    const departmentId = departmentSelect.value;
    if (departmentId) {
        fetchArtworksByDepartment(departmentId); 
    } else {
        alert('Please select a department first.');
    }
});
