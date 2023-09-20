import JsFileDownloader from 'js-file-downloader'

export function clientDownload({ url, ...params }: NonNullable<ConstructorParameters<typeof JsFileDownloader>[0]>) {
  return new JsFileDownloader({ url: new URL(url, window.location.origin).toString(), ...params })
}
