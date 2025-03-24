/*==================== SHOW NAVBAR ====================*/
const showMenu = (headerToggle, navbarId) =>{
    const toggleBtn = document.getElementById(headerToggle),
    nav = document.getElementById(navbarId)

    if(headerToggle && navbarId){
        toggleBtn.addEventListener('click', ()=>{
            nav.classList.toggle('show-menu')
            toggleBtn.classList.toggle('bx-x')
        })
    }
}
showMenu('header-toggle','navbar')

/*==================== LINK ACTIVE ====================*/
const linkColor = document.querySelectorAll('.nav__link')

function colorLink(){
    linkColor.forEach(l => l.classList.remove('active'))
    this.classList.add('active')
}

linkColor.forEach(l => l.addEventListener('click', colorLink))

document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('toggle');
    const body = document.body;

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        toggleSwitch.checked = false;  // Show "Light Mode" (unchecked)
    } else {
        body.classList.remove('dark-mode');
        toggleSwitch.checked = true;  // Show "Dark Mode" (checked)
    }

    toggleSwitch.addEventListener('change', function() {
        if (toggleSwitch.checked) {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');  // Save Light Mode
        } else {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');   // Save Dark Mode
        }
    });
});
