
export class ImageUtils {

	private static fileUrl: string;

	static getCroppedImg(image: any, crop: any, fileName: string): Promise<{ url: string, blob: any }> {
		const canvas = document.createElement('canvas');
		const pixelRatio = window.devicePixelRatio;
		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		const ctx = canvas.getContext('2d') as any;

		canvas.width = crop.width * pixelRatio * scaleX;
		canvas.height = crop.height * pixelRatio * scaleY;

		ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
		ctx.imageSmoothingQuality = 'high';

		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			crop.width * scaleX,
			crop.height * scaleY
		);

		return new Promise((resolve, reject) => {
			canvas.toBlob(
				(blob: any) => {
					if (!blob) {
						//reject(new Error('Canvas is empty'));
						console.error('Canvas is empty');
						return;
					}
					blob.name = fileName;
					window.URL.revokeObjectURL(this.fileUrl);
					this.fileUrl = window.URL.createObjectURL(blob);
					resolve({ url: this.fileUrl, blob });
				},
				'image/jpeg',
				1
			);
		});
	}
	static getBase64FromBlob(blob: string): Promise<string> {
		return new Promise((resolve, _) => {
			const reader = new FileReader() as any;
			reader.onloadend = () => resolve(reader.result);
			reader.readAsDataURL(blob);
		});
	}

};