/**
 * IMC Express - Geolocation-based Contact Information
 * Dynamically displays the nearest office contact details based on visitor location
 */
(function() {
    'use strict';

    var OFFICES = {
        de: {
            country: 'Deutschland',
            city: 'Saarbr\u00fccken',
            addressHtml: 'Scheer Tower, Uni Campus Nord<br>66123 Saarbr\u00fccken, Deutschland',
            phone: '+49 681 94760',
            phoneTel: '+4968194760',
            fax: '+49 681 9476 530',
            email: 'info@scheer-imc.com',
            lat: 49.2354,
            lon: 6.9961
        },
        ch: {
            country: 'Schweiz',
            city: 'Kloten',
            addressHtml: 'Flughafenstrasse 7<br>8302 Kloten, Schweiz',
            phone: '+41 43 299 99 00',
            phoneTel: '+41432999900',
            fax: null,
            email: 'info@scheer-imc.com',
            lat: 47.4515,
            lon: 8.5648
        },
        at: {
            country: '\u00d6sterreich',
            city: 'Graz',
            addressHtml: 'St. Peter Hauptstra\u00dfe 27<br>8042 Graz, \u00d6sterreich',
            phone: '+43 316 253 665 0',
            phoneTel: '+433162536650',
            fax: '+43 316 253 665 99',
            email: 'info@scheer-imc.com',
            lat: 47.0707,
            lon: 15.4395
        },
        gb: {
            country: 'UK',
            city: 'London',
            addressHtml: 'Unit 2, The Wireworks<br>79 Great Suffolk St, London SE1 0BU, UK',
            phone: '+44 207 173 6580',
            phoneTel: '+442071736580',
            fax: null,
            email: 'info@scheer-imc.com',
            lat: 51.5074,
            lon: -0.1278
        },
        nl: {
            country: 'Niederlande',
            city: "'s-Hertogenbosch",
            addressHtml: "Parallelweg 30<br>5223 AL 's-Hertogenbosch, Niederlande",
            phone: '+31 647 670 605',
            phoneTel: '+31647670605',
            fax: null,
            email: 'info@scheer-imc.com',
            lat: 51.6998,
            lon: 5.3042
        },
        ro: {
            country: 'Rum\u00e4nien',
            city: 'Sibiu',
            addressHtml: 'Str. Nicolaus Olahus, Nr. 5<br>Corp A, Etaj 15, 550370 Sibiu, Rum\u00e4nien',
            phone: '+40 269 225 060',
            phoneTel: '+40269225060',
            fax: null,
            email: 'info@scheer-imc.com',
            lat: 45.7983,
            lon: 24.1256
        },
        au: {
            country: 'Australien',
            city: 'Melbourne',
            addressHtml: 'Level 9, 637 Flinders Street<br>Docklands, VIC 3008, Australien',
            phone: '+61 1300 883 043',
            phoneTel: '+611300883043',
            fax: '+61 3 8648 5921',
            email: 'info@scheer-imc.com',
            lat: -37.8136,
            lon: 144.9631
        },
        sg: {
            country: 'Singapur',
            city: 'Singapur',
            addressHtml: '60 Paya Lebar Road #10-13<br>Paya Lebar Square, 409051 Singapur',
            phone: '+65 6513 3358',
            phoneTel: '+6565133358',
            fax: null,
            email: 'info@scheer-imc.com',
            lat: 1.3521,
            lon: 103.8198
        },
        us: {
            country: 'USA',
            city: 'New York',
            addressHtml: '1040 Sixth Ave, Ste 14C<br>New York, NY 10018, USA',
            phone: '585-540-4607',
            phoneTel: '+15855404607',
            fax: '866-827-9623',
            email: 'info@scheer-imc.com',
            lat: 40.7128,
            lon: -74.0060
        }
    };

    // Direct country-to-office mappings
    var COUNTRY_TO_OFFICE = {
        'DE': 'de',
        'CH': 'ch',
        'LI': 'ch',
        'AT': 'at',
        'GB': 'gb',
        'IE': 'gb',
        'NL': 'nl',
        'BE': 'nl',
        'LU': 'nl',
        'RO': 'ro',
        'AU': 'au',
        'NZ': 'au',
        'SG': 'sg',
        'US': 'us',
        'CA': 'us',
        'MX': 'us'
    };

    // Italy and Eastern European countries -> Austria
    var AUSTRIA_COUNTRIES = [
        'IT', 'PL', 'CZ', 'SK', 'HU', 'BG', 'HR', 'SI', 'RS',
        'BA', 'ME', 'MK', 'AL', 'XK', 'MD', 'UA', 'BY', 'LT', 'LV', 'EE'
    ];

    // European country codes
    var EUROPEAN_COUNTRIES = [
        'DE', 'CH', 'AT', 'GB', 'NL', 'RO', 'FR', 'ES', 'PT', 'IT',
        'BE', 'LU', 'DK', 'SE', 'NO', 'FI', 'IS', 'IE', 'PL', 'CZ',
        'SK', 'HU', 'BG', 'HR', 'SI', 'RS', 'BA', 'ME', 'MK', 'AL',
        'XK', 'MD', 'UA', 'BY', 'LT', 'LV', 'EE', 'MT', 'CY', 'GR',
        'TR', 'LI', 'MC', 'SM', 'VA', 'AD', 'GI'
    ];

    var EUROPEAN_OFFICES = ['de', 'ch', 'at', 'gb', 'nl', 'ro'];

    function haversineDistance(lat1, lon1, lat2, lon2) {
        var R = 6371;
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function findNearestOffice(lat, lon, officeKeys) {
        var nearest = null;
        var minDist = Infinity;
        officeKeys.forEach(function(key) {
            var office = OFFICES[key];
            var dist = haversineDistance(lat, lon, office.lat, office.lon);
            if (dist < minDist) {
                minDist = dist;
                nearest = key;
            }
        });
        return nearest;
    }

    function getOfficeForLocation(countryCode, lat, lon) {
        // 1. Direct country mapping (countries with their own office or clear neighbor)
        if (COUNTRY_TO_OFFICE[countryCode]) {
            return COUNTRY_TO_OFFICE[countryCode];
        }
        // 2. Italy and Eastern European countries -> Austria
        if (AUSTRIA_COUNTRIES.indexOf(countryCode) !== -1) {
            return 'at';
        }
        // 3. European countries without office -> nearest European office
        if (EUROPEAN_COUNTRIES.indexOf(countryCode) !== -1) {
            return findNearestOffice(lat, lon, EUROPEAN_OFFICES);
        }
        // 4. Non-European countries -> nearest office globally
        return findNearestOffice(lat, lon, Object.keys(OFFICES));
    }

    function updateContactInfo(officeKey) {
        var office = OFFICES[officeKey];
        if (!office) return;

        // Update phone text
        document.querySelectorAll('[data-geo="phone"]').forEach(function(el) {
            var phoneText = office.phone;
            if (office.fax) {
                phoneText += ' | Fax: ' + office.fax;
            }
            el.textContent = phoneText;
        });

        // Update phone links (tel: href)
        document.querySelectorAll('[data-geo="phone-link"]').forEach(function(el) {
            el.href = 'tel:' + office.phoneTel;
        });

        // Update phone CTA buttons (tel: href only)
        document.querySelectorAll('[data-geo="phone-cta"]').forEach(function(el) {
            el.href = 'tel:' + office.phoneTel;
        });

        // Update email text
        document.querySelectorAll('[data-geo="email"]').forEach(function(el) {
            el.textContent = office.email;
        });

        // Update email links (mailto: href + text)
        document.querySelectorAll('[data-geo="email-link"]').forEach(function(el) {
            el.href = 'mailto:' + office.email;
            el.textContent = office.email;
        });

        // Update address (innerHTML for line breaks)
        document.querySelectorAll('[data-geo="address"]').forEach(function(el) {
            el.innerHTML = office.addressHtml;
        });

        // Update phone placeholder in forms
        document.querySelectorAll('[data-geo="phone-placeholder"]').forEach(function(el) {
            el.placeholder = office.phone;
        });
    }

    function initGeoContact() {
        var defaultOffice = 'de';

        fetch('https://get.geojs.io/v1/ip/geo.json')
            .then(function(response) { return response.json(); })
            .then(function(data) {
                var countryCode = (data.country_code || '').toUpperCase();
                var lat = parseFloat(data.latitude) || 0;
                var lon = parseFloat(data.longitude) || 0;

                if (countryCode) {
                    var officeKey = getOfficeForLocation(countryCode, lat, lon);
                    updateContactInfo(officeKey || defaultOffice);
                } else {
                    updateContactInfo(defaultOffice);
                }
            })
            .catch(function() {
                updateContactInfo(defaultOffice);
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGeoContact);
    } else {
        initGeoContact();
    }
})();
