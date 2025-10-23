export function generateSerialNumber(): string {
	const now = new Date();
	const pad = (n: number) => n.toString().padStart(2, '0');
	const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
	const timeStr = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
	const rand = Math.floor(Math.random() * 10000)
		.toString()
		.padStart(4, '0');
	return `SN-${dateStr}-${timeStr}-${rand}`;
}
