document.addEventListener('DOMContentLoaded', function() {
    // Form data variables
    let highestLevelEducation = 'Not provided';
    let help = 'Not selected';
    let admitStatus = 'Not selected';
    let preferredIntake = 'Not provided';
    let ieltsStatus = 'Not provided';
    let grades = 'Not provided';
    let preferredProgram = 'Not provided';
    let passportStatus = 'Not provided';
    let gradeMetric = 'Not determined';
    let userCity = 'Not selected', userState = 'Not selected';

    let isSubmitting = false; // Prevent multiple submissions

    // Get form elements
    const submitButton = document.getElementById('submitBtn');
    const continueButton1 = document.querySelector('[valid="btn1"]');
    const continueButton2 = document.querySelector('[valid="btn2"]');
    const phoneInput = document.querySelector('[name="phone"]');
    const nameInput = document.querySelector('[name="name"]');
    const emailInput = document.querySelector('[name="email"]');
    const helpSelect = document.querySelector('select[name="help"]');
    const citySelect = document.querySelector('input[name="city"]');
    const form = document.querySelector('form');
    const preferredCountry = document.getElementById('native-form-code').getAttribute('country');
    const phoneWarning = document.getElementById("warning-phone");
    const emailWarning = document.getElementById("warning-email");
    const nameWarning = document.getElementById("warning-name");
    const phonePattern = /^(?:(?:\+?91|0)?[6-9]\d{9})$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const intakeWarning = document.getElementById('warning-intake');
    const programWarning = document.getElementById('warning-program');
    const ieltsWarning = document.getElementById('warning-ielts');
    const cityWarning = document.getElementById('warning-city');
    const passportWarning = document.getElementById('warning-passport');
    const eduWarning = document.getElementById('warning-edu');

    // Functions to toggle warning visibility
    const toggleWarning = (warningElem, isValid) => warningElem.style.display = isValid ? "none" : "block";
    const toggleNameWarning = isValid => toggleWarning(nameWarning, isValid);
    const togglePhoneWarning = isValid => toggleWarning(phoneWarning, isValid);
    const toggleEmailWarning = isValid => toggleWarning(emailWarning, isValid);

    nameInput.addEventListener('input', () => {
        toggleNameWarning(nameInput.value.trim() !== '');
    });
    phoneInput.addEventListener('input', () => {
        togglePhoneWarning(phonePattern.test(phoneInput.value));
    });
    emailInput.addEventListener('input', () => {
        toggleEmailWarning(emailPattern.test(emailInput.value));
    });

    // Save form data in local storage
    function saveToLocalStorage() {
        try {
            localStorage.setItem('name', nameInput.value);
            localStorage.setItem('phone', phoneInput.value);
            localStorage.setItem('email', emailInput.value);
        } catch (error) {
            console.error('Unable to access local storage:', error);
        }
    }

    // Pre-fill form data from local storage
    function prefillFromLocalStorage() {
        try {
            const savedName = localStorage.getItem('name');
            const savedPhone = localStorage.getItem('phone');
            const savedEmail = localStorage.getItem('email');
            const ajsUserId = localStorage.getItem('ajs_user_id');

            if (savedName) nameInput.value = savedName;
            if (savedPhone) phoneInput.value = savedPhone;
            else phoneInput.disabled = false;

            if (savedEmail) emailInput.value = savedEmail;

            if (ajsUserId && ajsUserId !== 'null' && savedPhone) phoneInput.disabled = true;
        } catch (error) {
            console.error('Unable to access local storage:', error);
        }
    }

    prefillFromLocalStorage();

    // Function to update text based on helpSelect value
    function updateText(helpSelectValue) {
        const h1Element = document.getElementById('h1-last');
        const ctaElement = document.getElementById('cta-text');
        if (!h1Element || !ctaElement) return;

        const messages = {
            '1': { h1: "Provide your details to check your Admit Eligibility", cta: "Check your Admit Eligibility" },
            '2': { h1: "Provide your details for End to End Guidance", cta: "Get End to End Guidance" },
            '6': { h1: "Provide your details to start your Study Abroad journey", cta: "Start your Study Abroad Journey" },
            '5': { h1: "Provide your details to get a personalized shortlist for your profile", cta: "Get a Shortlist" }
        };

        const text = messages[helpSelectValue] || { h1: h1Element.textContent, cta: ctaElement.textContent };
        h1Element.textContent = text.h1;
        ctaElement.textContent = text.cta;
    }

    helpSelect.addEventListener('change', () => {
        updateText(helpSelect.value);
    });

    if (helpSelect.value) updateText(helpSelect.value);

    function extractCityAndState(location) {
        const parts = location.split(',');
        return { city: parts[0].trim(), state: parts[1]?.trim() || '' };
    }

    function extractFormData() {
        highestLevelEducation = document.querySelector('input[name="highestLevelEducation"]:checked')?.value || highestLevelEducation;
        help = helpSelect?.value || help;
        ({ city: userCity, state: userState } = extractCityAndState(citySelect?.value || ''));
        preferredIntake = document.querySelector('input[name="preferredIntake"]:checked')?.value || preferredIntake;
        ieltsStatus = document.querySelector('input[name="ieltsStatus"]:checked')?.value || ieltsStatus;
        preferredProgram = document.querySelector('input[name="preferredProgram"]:checked')?.value || preferredProgram;
        passportStatus = document.querySelector('input[name="passportStatus"]:checked')?.value || passportStatus;
    }

    function validateStep1() {
        let isValid = true;
        if (!preferredIntake || preferredIntake === 'Not provided') {
            toggleWarning(intakeWarning, false);
            isValid = false;
        } else {
            toggleWarning(intakeWarning, true);
        }

        if (!preferredProgram || preferredProgram === 'Not provided') {
            toggleWarning(programWarning, false);
            isValid = false;
        } else {
            toggleWarning(programWarning, true);
        }

        if (!ieltsStatus || ieltsStatus === 'Not provided') {
            toggleWarning(ieltsWarning, false);
            isValid = false;
        } else {
            toggleWarning(ieltsWarning, true);
        }

        return isValid;
    }

    function validateStep2() {
        let isValid = true;
        if (!userCity || userCity === 'Not selected') {
            toggleWarning(cityWarning, false);
            isValid = false;
        } else {
            toggleWarning(cityWarning, true);
        }

        if (!passportStatus || passportStatus === 'Not provided') {
            toggleWarning(passportWarning, false);
            isValid = false;
        } else {
            toggleWarning(passportWarning, true);
        }

        if (!highestLevelEducation || highestLevelEducation === 'Not provided') {
            toggleWarning(eduWarning, false);
            isValid = false;
        } else {
            toggleWarning(eduWarning, true);
        }

        return isValid;
    }

    // Event listener for submit button click with debounce logic
    if (submitButton) {
        submitButton.addEventListener('click', event => {
            event.preventDefault();

            if (isSubmitting) {
                console.log("Already submitting, please wait.");
                return;
            }

            console.log("Submit button clicked.");
            isSubmitting = true; // Lock submission
            submitButton.disabled = true; // Disable the button
            document.getElementById('cta-text').textContent = "Please wait..."; // Update CTA text

            emailInput.value = emailInput.value.toLowerCase();

            const isValidPhone = phonePattern.test(phoneInput.value);
            const isValidEmail = emailPattern.test(emailInput.value);
            const isValidName = nameInput.value.trim() !== '';

            togglePhoneWarning(isValidPhone);
            toggleEmailWarning(isValidEmail);
            toggleNameWarning(isValidName);

            if (!isValidPhone || !isValidEmail || !isValidName) {
                console.log("Invalid inputs, stopping form submission.");
                isSubmitting = false; // Unlock submission on failure
                submitButton.disabled = false; // Re-enable the button
                document.getElementById('cta-text').textContent = "Submit"; // Reset CTA text
                return;
            }

            extractFormData();
            
            if (window.analytics) {
                console.log("Firing identify event...");
                window.analytics.identify({
                    name: nameInput.value,
                    email: emailInput.value,
                    phone: phoneInput.value
                });
            } else {
                console.error("Segment analytics not loaded.");
            }

            const urlParams = new URLSearchParams(window.location.search);
            const formDataObj = {
                name: nameInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
                preferredCountry,
                preferredProgram,
                howLeapHelp: help,
                userCity,
                userState,
                admitStatus: "NOT_APPLIED",
                ieltsStatus,
                preferredIntake,
                highestLevelEducation,
                grades: "7",
                passportStatus,
                gradeMetric: "CGPA",
                formId: "counselling_native_wf_form",
                utmSource: urlParams.get('utm_source') || "",
                utmMedium: urlParams.get('utm_medium') || "",
                utmCampaign: urlParams.get('utm_campaign') || "",
                utmTerm: urlParams.get('utm_term') || "",
                campaignType: urlParams.get('campaign_type') || "",
                adId: urlParams.get('ad_id') || "",
                gclid: urlParams.get('gclid') || "",
                fbclid: urlParams.get('fbclid') || ""
            };

            // Send Segment Event
            if (window.analytics) {
                console.log("Firing Segment event...");
                window.analytics.track("Form Submit WF", {
                    contentName: "Form Submit WF",
                    utmCampaign: urlParams.get('utm_campaign') || "NA",
                    utmSource: urlParams.get('utm_source') || "NA",
                    utmTerm: urlParams.get('utm_term') || "NA",
                    adId: urlParams.get('ad_id') || "NA",
                    adName: "NA",
                    referrer: document.referrer || "NA"
                });
            } else {
                console.error("Segment analytics not loaded.");
            }

            // Submit data to API
            fetch('https://api.leapscholar.com/webflow/spot-counseling/student/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataObj),
            })
            .then(response => {
                console.log("POST request response received:", response);
                return response.json();
            })
            .then(data => {
                console.log('Form submission success:', data);
            })
            .catch((error) => {
                console.error('Form submission error:', error);
            })
            .finally(() => {
                const redirectURL = `https://leapscholar.com/login?redirected=true&callbackUrl=/meeting-finder?prefilled_phone=${encodeURIComponent(phoneInput.value)}&formId=counselling_native_wf_form&utm_source=${encodeURIComponent(urlParams.get('utm_source') || "")}&utm_medium=${encodeURIComponent(urlParams.get('utm_medium') || "")}&utm_campaign=${encodeURIComponent(urlParams.get('utm_campaign') || "")}&utm_term=${encodeURIComponent(urlParams.get('utm_term') || "")}&campaign_type=${encodeURIComponent(urlParams.get('campaign_type') || "")}&ad_id=${encodeURIComponent(urlParams.get('ad_id') || "")}&gclid=${encodeURIComponent(urlParams.get('gclid') || "")}&fbclid=${encodeURIComponent(urlParams.get('fbclid') || "")}`;

                console.log('Redirection URL:', redirectURL);
                window.location.href = redirectURL;
            });
        });
    } else {
        console.log("Submit button not found.");
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const citySearchInput = document.querySelector('input[name="citySearch"]');
    const cityReadOnlyInput = document.querySelector('input[name="city"]');
    const modalCloseLink = document.querySelector('#modal-close');
    const resultsContainer = document.querySelector('.search-results');
    const modal = document.querySelector('.city-selector_modal');
    let currentSelectionIndex = -1; // Index to track currently highlighted item
    let initialResults = []; // Store the initial fetched results

    // Make the city input read-only with a white background
    cityReadOnlyInput.setAttribute('readonly', true);
    cityReadOnlyInput.style.backgroundColor = '#ffffff'; // Apply white background color

    // Debounce function
    const debounce = (func, delay) => {
        let debounceTimer;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    };

    // Handle search input changes with immediate "Searching..." message
    citySearchInput.addEventListener('input', function () {
        const query = this.value.trim();
        showSearchingMessage(); // Show immediately

        // Debounced API fetching
        debouncedFetch(query);
    });

    // Debounced fetch function with a delay of 400ms
    const debouncedFetch = debounce(async function (query) {
        if (query.length > 2) {
            await fetchAndDisplayResults(query);
        } else {
            displayResults({ success: true, data: initialResults }); // Use initial results if query is too short
        }
    }, 400);

    // Display "Searching..." message
    function showSearchingMessage() {
        resultsContainer.innerHTML = '<div class="searching-message">Searching...</div>';
    }

    // Fetch and display results function
    async function fetchAndDisplayResults(query = '') {
        try {
            let url;
            if (query) {
                url = `https://api.leapscholar.com/webflow/countries/India/state-cities?city=${encodeURIComponent(query)}`;
            } else {
                // Provide the endpoint for the default initial data set
                url = `https://api.leapscholar.com/webflow/countries/India/state-cities`;
            }

            const response = await fetch(url);
            const data = await response.json();

            // Cache the initial results for fallback
            if (!query) {
                initialResults = data.data;
            }

            displayResults(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Render results and set up click event listeners
    function displayResults(data) {
        resultsContainer.innerHTML = ''; // Clear previous results
        currentSelectionIndex = -1; // Reset selection index

        if (data.success && data.data.length > 0) {
            data.data.forEach((city, index) => {
                const resultItem = document.createElement('div');
                resultItem.textContent = city;
                resultItem.classList.add('result-item');

                // Click event to update input value with selected item and trigger modal-close
                resultItem.addEventListener('click', () => {
                    selectResult(index);
                    triggerModalClose();
                });

                resultsContainer.appendChild(resultItem);
            });
        } else {
            // Show "No cities found" message if no cities were found
            resultsContainer.innerHTML = '<div class="no-results-message">No cities found</div>';
        }
    }

    // Select the result by index
    function selectResult(index) {
        const items = resultsContainer.querySelectorAll('.result-item');
        items.forEach((item, i) => {
            item.classList.toggle('selected', i === index);
        });

        if (index >= 0 && index < items.length) {
            const selectedCity = items[index].textContent;
            citySearchInput.value = selectedCity; // Update the search input
            updateCityReadOnlyInput(selectedCity); // Update the read-only input field
        }
    }

    // Update the city read-only input with the selected city
    function updateCityReadOnlyInput(selectedCity) {
        cityReadOnlyInput.value = selectedCity;

        // Dispatch a custom event to simulate the change event
        const event = new Event('change', { bubbles: true });
        cityReadOnlyInput.dispatchEvent(event);
    }

    // Trigger a click on the modal-close link
    function triggerModalClose() {
        if (modalCloseLink) {
            modalCloseLink.click();
        }
    }

    // Handle keyboard navigation and selection
    citySearchInput.addEventListener('keydown', (event) => {
        const items = resultsContainer.querySelectorAll('.result-item');

        if (event.key === 'ArrowDown') {
            // Move down in the results list
            currentSelectionIndex = (currentSelectionIndex + 1) % items.length;
        } else if (event.key === 'ArrowUp') {
            // Move up in the results list
            currentSelectionIndex = (currentSelectionIndex - 1 + items.length) % items.length;
        } else if (event.key === 'Enter') {
            // Confirm selection
            if (currentSelectionIndex >= 0 && currentSelectionIndex < items.length) {
                items[currentSelectionIndex].click(); // Trigger click event for the selected item
            }
            return; // Prevent form submission on Enter
        } else {
            return; // Ignore other keys
        }

        // Update the selected item visually
        selectResult(currentSelectionIndex);
        event.preventDefault(); // Prevent default scrolling behavior
    });

    // Fetch initial results on page load
    fetchAndDisplayResults();

    // Observer to check when the modal is displayed
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.attributeName === 'style' && window.getComputedStyle(modal).display !== 'none') {
                citySearchInput.focus(); // Set focus to the search input
            }
        });
    });

    // Observe the 'style' attribute of the modal to detect display changes
    observer.observe(modal, { attributes: true });

    // Close the modal when clicking outside of it, but not on the city input
    document.addEventListener('click', function (event) {
        if (!modal.contains(event.target) && window.getComputedStyle(modal).display !== 'none' && event.target !== cityReadOnlyInput) {
            modalCloseLink.click();
        }
    });

    // Add a listener to log changes on cityReadOnlyInput
    cityReadOnlyInput.addEventListener('change', () => {
        console.log('City select changed:', cityReadOnlyInput.value);
        // Trigger validation or other actions as needed
        validation(); // Assuming you have a validation function to call
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const inputField = document.querySelector('input[name="citySearch"]');
    const placeholders = ["e.g. Delhi", "Search your city...", "e.g. Mumbai", "e.g. Bangalore", "e.g. Pune"];
    let currentIndex = 0;
    let typingInterval;
    let isPlaceholderCycling = false;

    function typePlaceholder(text) {
        let charIndex = 0;
        inputField.placeholder = '';
        clearInterval(typingInterval);
        typingInterval = setInterval(() => {
            if (inputField.value === '') { // Check if input is empty
                if (charIndex < text.length) {
                    inputField.placeholder += text[charIndex];
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                    setTimeout(changePlaceholder, 2000); // Delay before starting to type the next placeholder
                }
            } else {
                clearInterval(typingInterval); // Clear interval if input is not empty
            }
        }, 100); // Adjust typing speed by changing the interval time
    }

    function changePlaceholder() {
        if (inputField.value === '') { // Check if input is empty
            currentIndex = (currentIndex + 1) % placeholders.length;
            typePlaceholder(placeholders[currentIndex]);
        }
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isPlaceholderCycling) {
                isPlaceholderCycling = true;
                changePlaceholder(); // Initial call to start the cycle
            } else if (!entry.isIntersecting) {
                clearInterval(typingInterval);
                inputField.placeholder = placeholders[1]; // Reset to second index placeholder
                isPlaceholderCycling = false;
                currentIndex = 0; // Reset currentIndex to restart the cycle correctly
            }
        });
    });

    observer.observe(inputField);

    // Stop placeholder cycling when user starts typing
    inputField.addEventListener('input', () => {
        if (inputField.value !== '') {
            clearInterval(typingInterval);
            isPlaceholderCycling = false;
        }
    });

    // Initial call to start the placeholder cycling
    changePlaceholder();
});

// Function to add or remove the "is-on" class based on the step attribute of clicked buttons
function setupStepButtonClickListeners() {
  // Find the section with the ID 'native-form'
  const nativeForm = document.getElementById('native-form');

  if (nativeForm) {
    // Add event listener for buttons that activate full screen
    const fullScreenOnButtons = document.querySelectorAll('[step="full-screen-on"]');
    fullScreenOnButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        console.log(`"Full Screen On" button ${index + 1} clicked. Adding "is-on" class to #native-form.`);
        nativeForm.classList.add('is-on');
      });
    });

    // Add event listener for buttons that deactivate full screen
    const fullScreenOffButtons = document.querySelectorAll('[step="full-screen-off"]');
    fullScreenOffButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        console.log(`"Full Screen Off" button ${index + 1} clicked. Removing "is-on" class from #native-form.`);
        nativeForm.classList.remove('is-on');
      });
    });
  } else {
    console.log('Element with ID "native-form" not found.');
  }
}

// Execute the function on DOMContentLoaded
document.addEventListener('DOMContentLoaded', setupStepButtonClickListeners);
