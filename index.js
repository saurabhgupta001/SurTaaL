// Get visit count from localStorage
let visits = localStorage.getItem('visitCount');

// If it's the first visit, initialize it
if (visits === null) {
  visits = 1;
} else {
  visits = parseInt(visits) + 1;
}

// Store the updated count
localStorage.setItem('visitCount', visits);

// Display the count
document.getElementById('visitCount').textContent = visits;
    // Get the container element
    const container1 = document.querySelector('.a');

    // Add a click event listener
    container1.addEventListener('click', function() {
        // Redirect to new.html when clicked
        window.location.href = 'pl1.html'; // Replace with your desired page URL
    });
    const container2 = document.querySelector('.b');
    container2.addEventListener('click', function() {
        window.location.href = 'pl2.html'; 
    });
    const container3 = document.querySelector('.c');
    container3.addEventListener('click', function() {
        
        window.location.href = 'pl3.html'; 
    });
    const container4 = document.querySelector('.d');
    container4.addEventListener('click', function() {
        window.location.href = 'pl4.html'; 
    });
    const container5 = document.querySelector('.e');
    container5.addEventListener('click', function() {
       
        window.location.href = 'pl5.html';
    });
    const container6 = document.querySelector('.f');
    container6.addEventListener('click', function() {
        window.location.href = 'pl6.html'; 
    });
    const container7 = document.querySelector('.g');
    container7.addEventListener('click', function() {
        
        window.location.href = 'pl7.html'; 
    });
    const container8 = document.querySelector('.h');
    container8.addEventListener('click', function() {
        window.location.href = 'pl8.html'; 
    });
