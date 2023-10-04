//#region Main
const duckButton = document.getElementById("translateButton") as HTMLButtonElement | null;
const englishButton = document.getElementById("untranslateButton") as HTMLButtonElement | null;
const textInput = document.getElementById("textInput") as HTMLInputElement | null;
const output = document.getElementById("output");
if (!duckButton || !englishButton) throw new Error("Buttons don't exist somehow");
duckButton.addEventListener("click", () => {
    DisplayTranslation("duck");
});
englishButton.addEventListener("click", () => {
    DisplayTranslation("english");
});
type LooseObject = {[k: string]: string};
type LanguageType = keyof {duck: string; english: string};
type Collections = {collection: string; type: LanguageType};

const duck_language: LooseObject = {
    A: "Qack",
    B: "bead!",
    C: "quack?",
    D: "uak!",
    E: "brad?",
    F: "ack??",
    G: "quack!",
    H: "uc?!",
    I: "read?",
    J: "bread",
    K: "ead??",
    L: "uack!",
    M: "Qck?",
    N: "ead!!",
    O: "ack?",
    P: "read",
    Q: "Bead",
    R: "uak",
    S: "radd",
    T: "ead!",
    U: "Uak!",
    V: "uack",
    W: "uack?",
    X: "rad",
    Y: "Bread",
    Z: "uac",
};

// Reverse the duck_language object to create an untranslation object
const untranslate_language: LooseObject = {};
for (const key in duck_language) {
    if (duck_language.hasOwnProperty(key)) {
        const value = duck_language[key];
        untranslate_language[value] = key;
    }
}

// Display the translated text
function DisplayTranslation(type: LanguageType) {
    if (!textInput || !output) throw new Error("Buttons don't exist somehow");
    if (type === "duck") {
        output.innerHTML = Translate(textInput.value, "duck");
    }
    else {
        output.innerHTML = Translate(textInput.value, "english");
    }
}

// Translates anything that isn't the correct language type to the correct type
function Translate(input: string, type: LanguageType): string {
    const fullCollection = SeperateEnglishAndDuck(input);
    if (type == "duck") {
        for (let i = 0; i < fullCollection.length; i++) {
            const collection = fullCollection[i];
            if (collection.type == "english") {
                let letters: string[];
                if (collection.collection.length > 1) letters = collection.collection.split("");
                else letters = [fullCollection[i].collection];
                letters = DuckLetterTranslator(letters);
                fullCollection[i].collection = letters.join("");
            }
        }
    }
    else if (type == "english") {
        for (let i = 0; i < fullCollection.length; i++) {
            const collection = fullCollection[i];
            if (collection.type == "duck") {
                fullCollection[i].collection = untranslate_language[collection.collection];
            }
        }
    }
    return fullCollection.map(({collection}) => collection).join("");
}

// Changes english letters to duck letters
function DuckLetterTranslator(letters: string[]) {
    for (let i = 0; i < letters.length; i++) {
        let letter = letters[i];
        if (duck_language.hasOwnProperty(letter)) {
            letters[i] = duck_language[letter];
        }
        else {
            if (letter === letter.toLowerCase()) {
                letter = letter.toUpperCase();
                if (duck_language.hasOwnProperty(letter)) letters[i] = duck_language[letter];
            }
            else if (letter === letter.toUpperCase()) {
                letter = letter.toLowerCase();
                if (duck_language.hasOwnProperty(letter)) letters[i] = duck_language[letter];
            }
        }
    }
    return letters;
}

// This seperates english and the duck language and puts it in an array;
function SeperateEnglishAndDuck(input: string): Collections[] {
    let fullCollection: Collections[] = [];
    let newInput = input;
    const startLength = newInput.length;
    for (let i = 0; i < startLength; i++) {
        if (newInput.length == 0) break;
        const letters: string[] = [];
        let letterToCollect = "";
        for (const key in untranslate_language) {
            if (newInput.startsWith(key)) {
                letters.push(key);
            }
        }
        if (letters.length == 0) {
            letterToCollect = newInput.slice(0, 1);
            fullCollection.push({collection: letterToCollect, type: "english"});
            newInput = newInput.replace(letterToCollect, "");
        }
        else if (letters.length == 1) {
            letterToCollect = newInput.slice(0, letters[0].length);
            fullCollection.push({collection: letterToCollect, type: "duck"});
            newInput = newInput.replace(letterToCollect, "");
        }
        else if (letters.length > 1) {
            let foundPossibleInput = false;
            for (let i = 0; i < letters.length; i++) {
                const value = letters[i];
                if (newInput.startsWith(value)) {
                    const nextPossibleInput = newInput.replace(value, "");
                    for (const key in untranslate_language) {
                        if (nextPossibleInput.startsWith(key)) {
                            letterToCollect = newInput.slice(0, value.length);
                            foundPossibleInput = true;
                            break;
                        }
                    }
                }
            }
            if (foundPossibleInput) {
                console.log(letterToCollect);
                fullCollection.push({collection: letterToCollect, type: "duck"});
                newInput = newInput.replace(letterToCollect, "");
            }
            else {
                let maxDuckLetterSize = 0;
                for (let i = 0; i < letters.length; i++) {
                    const value = letters[i];
                    if (value.length > maxDuckLetterSize) {
                        letterToCollect = value;
                        maxDuckLetterSize = value.length;
                    }
                }
                console.log(letterToCollect);
                fullCollection.push({collection: letterToCollect, type: "duck"});
                newInput = newInput.replace(letterToCollect, "");
            }
        }
    }
    return fullCollection;
}
//#endregion

console.log(LongestIncreasingSubsequence([10, 22, 9, 33, 21, 50, 41, 60, 80]));

function LongestIncreasingSubsequence(array: number[]) {
    const n = array.length;
    const dp = new Array(n).fill(1); // Initialize an array to store LIS lengths

    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (array[i] > array[j] && dp[i] < dp[j] + 1) {
                dp[i] = dp[j] + 1;
            }
        }
    }

    return Math.max(...dp);
}

/* function LongestIncreasingSubsequence(array: number[]) {
    let longestIncSubArray: number[] = [];
    let tempArray: number[] = array;
    for (let i = 0; i < array.length; i++) {
        // const num = array[i];
        tempArray.splice(tempArray.indexOf(Math.min(...array)));
        longestIncSubArray.push(Math.min(...array));
    }
    return LongestIncreasingSubsequence.length
} */
