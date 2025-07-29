document.addEventListener('DOMContentLoaded', () => {
    const readabilityData = {
        loops: {
            before: `function processUsers(users) {
    var activeUsers = [];
    for (var i = 0; i < users.length; i++) {
        if (users[i].active) {
            var user = users[i];
            user.fullName = user.firstName + ' ' + user.lastName;
            activeUsers.push(user);
        }
    }
    return activeUsers;
}`,
            after: `const processUsers = (users) => {
    return users
        .filter(user => user.active)
        .map(user => ({
            ...user,
            fullName: `${user.firstName} ${user.lastName}`
        }));
};`
        },
        async: {
            before: `function getUserData(userId) {
    fetch('/api/users/' + userId)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data.name);
        })
        .catch(function(error) {
            console.error('Error fetching data:', error);
        });
}`,
            after: `const getUserData = async (userId) => {
    try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data.name);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};`
        },
        destructuring: {
            before: `function displayUser(user) {
    const name = user.name;
    const age = user.profile.age;
    const city = user.location.city;

    console.log(name + ' is ' + age + ' and lives in ' + city);
}`,
            after: `const displayUser = (user) => {
    const { name, profile: { age }, location: { city } } = user;

    console.log(`${name} is ${age} and lives in ${city}`);
};`
        }
    };
    const performanceData = {
        loadTime: {
            title: 'Initial Page Load Time (ms)',
            description: 'Time taken for the application to become interactive. Reduced by optimizing the critical rendering path and deferring non-essential scripts.',
            labels: ['Small App', 'Medium App', 'Large App'],
            before: [800, 1850, 3200],
            after: [550, 1258, 2100]
        },
        memory: {
            title: 'Peak Memory Usage (MB)',
            description: 'Maximum memory allocated during runtime. Improvements came from eliminating memory leaks and optimizing data structures.',
            labels: ['1k Records', '10k Records', '100k Records'],
            before: [45, 128, 350],
            after: [30, 97, 280]
        },
        dataProcessing: {
            title: 'Complex Data Processing Time (ms)',
            description: 'Time taken to run a heavy data aggregation task. Optimized by replacing inefficient algorithms with more performant alternatives.',
            labels: ['Dataset A', 'Dataset B', 'Dataset C'],
            before: [2500, 4100, 7800],
            after: [1100, 2200, 4500]
        },
        fps: {
            title: 'UI Rendering Average FPS',
            description: 'Frames Per Second during heavy UI interactions like scrolling large lists. Enhanced by virtualizing lists and reducing DOM updates.',
            labels: ['List Scroll', 'Chart Animation', 'Drag & Drop'],
            before: [28, 35, 22],
            after: [58, 55, 48]
        }
    };
    const codeBeforeEl = document.getElementById('code-before');
    const codeAfterEl = document.getElementById('code-after');
    const readabilityBtns = document.querySelectorAll('.readability-btn');
    function updateReadability(example) {
        codeBeforeEl.textContent = readabilityData[example].before;
        codeAfterEl.textContent = readabilityData[example].after;
        readabilityBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.example === example);
            btn.classList.toggle('bg-blue-500', btn.dataset.example === example);
            btn.classList.toggle('text-white', btn.dataset.example === example);
            btn.classList.toggle('bg-white', btn.dataset.example !== example);
            btn.classList.toggle('text-gray-700', btn.dataset.example !== example);
        });
    }
    readabilityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            updateReadability(btn.dataset.example);
        });
    });
    const ctx = document.getElementById('performanceChart').getContext('2d');
    let performanceChart;
    const chartDescriptionEl = document.getElementById('chart-description');
    const filterBtns = document.querySelectorAll('.filter-btn');
    function updateChart(metric) {
        const data = performanceData[metric];
        chartDescriptionEl.textContent = data.description;
        if (performanceChart) {
            performanceChart.destroy();
        }
        performanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Before Refactor',
                        data: data.before,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'After Refactor',
                        data: data.after,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: data.title,
                        font: { size: 18 },
                        padding: { bottom: 20 }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: data.title.includes('ms') ? 'Milliseconds (ms)' : (data.title.includes('MB') ? 'Megabytes (MB)' : (data.title.includes('FPS') ? 'Frames Per Second' : 'Value'))
                        }
                    }
                }
            }
        });
        filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.metric === metric);
        });
    }
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            updateChart(btn.dataset.metric);
        });
    });
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href').substring(1) === entry.target.id);
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });
    sections.forEach(section => {
        observer.observe(section);
    });
    updateReadability('loops');
    updateChart('loadTime');
}); 