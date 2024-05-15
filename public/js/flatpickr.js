
flatpickr("input[type=datetime-local]",{
    minDate: "today",
    maxDate: new Date().fp_incr(14),
    enableTime: true,
    minTime: "08:00",
    maxTime: "23:00",
    time_24hr: true,    
});