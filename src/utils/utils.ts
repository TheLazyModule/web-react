import {LatLngExpression} from "leaflet";
import parse from "wellknown";

export const parsePoint = (pointGeom: string | undefined): LatLngExpression | null => {
    if (!pointGeom) {
        return null
    }
    const parsed = parse(pointGeom);
    if (parsed && parsed.type === "Point" && parsed.coordinates.length === 2) {
        // Swap from [longitude, latitude] to [latitude, longitude]
        const [longitude, latitude] = parsed.coordinates;
        return [latitude, longitude] as LatLngExpression;
    }
    return null;
};

export function estimateWalkingTime(distanceMeters: number | null): number {
    if (distanceMeters === null) return 0;

    const walkingSpeedMetersPerSecond = 1.4; // Average walking speed in meters per second
    const timeInSeconds = distanceMeters / walkingSpeedMetersPerSecond;
    const timeInMinutes = timeInSeconds / 60;

    // Cap the time at 60 minutes and round to the nearest minute
    return Math.round(Math.min(timeInMinutes, 60));
}


function getDeviceType() {
    const userAgent = navigator.userAgent;

    if (/mobile/i.test(userAgent)) {
        return "Mobile";
    } else if (/tablet/i.test(userAgent)) {
        return "Tablet";
    } else if (/iPad|Android/i.test(userAgent) && !/Mobile/i.test(userAgent)) {
        return "Tablet";
    } else if (/iPhone|iPod/i.test(userAgent)) {
        return "iPhone";
    } else if (/iPad/i.test(userAgent)) {
        return "iPad";
    } else if (/Android/i.test(userAgent)) {
        return "Android Device";
    } else if (/Windows Phone/i.test(userAgent)) {
        return "Windows Phone";
    } else {
        return "Desktop";
    }
}

console.log(getDeviceType()); // Outputs the detected device type

export default parsePoint;
