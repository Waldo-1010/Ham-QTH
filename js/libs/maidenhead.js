function gridForLatLon(latitude, longitude) {
    const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWX';
    const LOWERCASE = UPPERCASE.toLowerCase();

    // Validate latitude
    const lat = parseFloat(latitude);
    if (isNaN(lat) || Math.abs(lat) > 90) {
        throw new Error("Invalid latitude");
    }

    // Validate longitude
    const lon = parseFloat(longitude);
    if (isNaN(lon) || Math.abs(lon) > 180) {
        throw new Error("Invalid longitude");
    }

    // Adjust latitude and longitude
    const adjLat = lat + 90;
    const adjLon = lon + 180;

    // Calculate grid square components
    const fieldLat = UPPERCASE[Math.trunc(adjLat / 10)];
    const squareLat = Math.trunc(adjLat % 10).toString();
    const subLat = LOWERCASE[Math.trunc((adjLat - Math.trunc(adjLat)) * 60 / 2.5)];

    const fieldLon = UPPERCASE[Math.trunc(adjLon / 20)];
    const squareLon = Math.trunc((adjLon / 2) % 10).toString();
    const subLon = LOWERCASE[Math.trunc((adjLon - 2 * Math.trunc(adjLon / 2)) * 60 / 5)];

    // Combine components to form the Maidenhead locator
    return fieldLon + fieldLat + squareLon + squareLat + subLon + subLat;
}
