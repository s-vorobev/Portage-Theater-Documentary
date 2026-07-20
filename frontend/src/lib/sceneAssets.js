export const BACKGROUNDS = {
  theatre: { src: '/theatre_desktop.png', width: 3914, height: 1957 },
  // theatre_mobile.png
}

export const ASSETS = {
  contactUs: {
    src: '/ContactUs/default.svg',
    hoverSrc: '/ContactUs/hover.svg',
    clickSrc: '/ContactUs/click.svg',
    nativeWidth: 298,
    nativeHeight: 95,
  },
  donateNow: {
    src: '/DonateNow/default.svg',
    hoverSrc: '/DonateNow/hover.svg',
    clickSrc: '/DonateNow/click.svg',
    nativeWidth: 298,
    nativeHeight: 96,
  },
  viewOurProgress: {
    src: '/ViewOurProgress/default.svg',
    hoverSrc: '/ViewOurProgress/hover.svg',
    clickSrc: '/ViewOurProgress/click.svg',
    nativeWidth: 318,
    nativeHeight: 57,
  },
}

export function placeAsset(
  asset,
  { centerX, centerY, scale = 1, rotateDeg = 0 },
) {
  const width = asset.nativeWidth * scale
  const height = asset.nativeHeight * scale
  const x = centerX - width / 2
  const y = centerY - height / 2
  return {
    href: asset.src,
    hoverHref: asset.hoverSrc,
    clickHref: asset.clickSrc,
    x,
    y,
    width,
    height,
    transform: rotateDeg
      ? `rotate(${rotateDeg} ${centerX} ${centerY})`
      : undefined,
  }
}
