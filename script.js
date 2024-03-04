//CONSTANTS
const calorieCounter = document.getElementById('calorie-counter') //To access an HTML element with a given id name
const budgetNumberInput = document.getElementById('budget')  //const/variable + value
const entryDropdown = document.getElementById('entry-dropdown')
const addEntryButton = document.getElementById('add-entry')
const clearButton = document.getElementById('clear')
const output = document.getElementById('output')

//VARIABLES
let isError = false

function cleanInputString(str) { //function/name/parameter
    const regex = /[+-\s]/g;  //regex=(Regular Expressions) to match specific characters within the /---/
    //[]=finds the individual characters contained within 
    //\s=white spaces
    // g=(global flag) continues search globally even after it finds a match
    return str.replace(regex, ''); //return the str and replace regex with ''(empty space)
}

function isInvalidInput(str) {
    const regex = /\d+e\d+/i; // i=(insensitive flag) can find lowercase and uppercase
    // + =match a pattern that occurs one or more times
    // \d= digit shorthand
    return str.match(regex); // returns the str that matches the regex
}

function addEntry(){
    const targetId = '#' + entryDropdown.value; //const/variable + value
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`); // ``=(Template literals) allows to interpolate variables directly within a string.
    //${VARIABLE} the value of the variable will be inserted into the string.
    const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1; //querySelectorAll() returns a NodeList which is an array-like object, so you can access the elements using bracket notation.
    const HTMLString = `
    <label for ="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
    <input type="text" placeholder="Name" id="${entryDropdown.value}-${entryNumber}-name> 
    <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
    <input
        type="number"
        min="0"
        id="${entryDropdown.value}-${entryNumber}-calories"
        placeholder="Calories">`;
    targetInputContainer.insertAdjacentHTML("beforeend", HTMLString); //.insertAdjacentHTML =(preserve your input content)
    //"beforeend" =(string that specifies position of inserted element)
    //HTMLString=(string of HTML to be inserted)
}

function calculateCalories(e) { // This function will be another event listener, so the first argument passed will be the browser event – e is a common name for this parameter.
    e.preventDefault(); //prevents the default action of the submit event to reload the page. 
    isError = false;

    const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
    const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
    const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
    const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
    const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');

    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

    if (isError) {
        return;
    }
    const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
    const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';
    output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span> 
    <hr> 
    <p>${budgetCalories} Calories Budgeted</p>;
    <p>${consumedCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>
    `;// math.abs =method that will return the absolute value of a number
    output.classList.remove('hide');
};

function getCaloriesFromInputs(list) { //list parameter is result of query selector which will return NodeList
    let calories = 0;
    for(const item of list) {
        const currVal = cleanInputString(item.value);
        const invalidInputMatch = isInvalidInput(currVal);
        if (invalidInputMatch) {
            alert(`Invalid Input: ${invalidInputMatch[0]}`);
            isError = true;
            return null;
        }
        calories += Number(currVal) //pass currVal through number constructor to convert it
    }
    return calories
}

function clearForm(){ //document.querySelectorAll =returns a NodeList which is array-like
// .from() =method that accepts an array-like and returns an array
    const inputContainers = Array.from(document.querySelectorAll('.input-container'));
    for (const container of inputContainers) {
        container.innerHTML = '';
      }
    budgetNumberInput.value = '';
    output.innerText = '';
    output.classList.add('hide');
};

addEntryButton.addEventListener("click", addEntry); //.addEventListener =(to add a click event to a button)
//.addEventListener TAKES 2 ARGUMENTS (1st=event to listen to)(2nd=call back function to runs when event is triggered)
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener('click', clearForm);