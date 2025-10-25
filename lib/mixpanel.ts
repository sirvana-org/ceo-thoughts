import mixpanel, { type Dict } from "mixpanel-browser";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

let isInitialized = false;

export const initMixpanel = () => {
	if (typeof window === "undefined") return;

	if (!MIXPANEL_TOKEN) {
		console.warn("Mixpanel token is missing! Check your .env file.");
		return;
	}

	if (!isInitialized) {
		mixpanel.init(MIXPANEL_TOKEN, {
			debug: process.env.NODE_ENV === "development",
			track_pageview: true,
			persistence: "localStorage",
		});
		isInitialized = true;
	}
};

export const trackEvent = (eventName: string, properties?: Dict) => {
	if (!isInitialized) return;
	mixpanel.track(eventName, properties);
};

export const identifyUser = (userId: string) => {
	if (!isInitialized) return;
	mixpanel.identify(userId);
};

export const setUserProperties = (properties: Dict) => {
	if (!isInitialized) return;
	mixpanel.people.set(properties);
};

export const registerSuperProperties = (properties: Dict) => {
	if (!isInitialized) return;
	mixpanel.register(properties);
};

export const resetUser = () => {
	if (!isInitialized) return;
	mixpanel.reset();
};

export { mixpanel };
