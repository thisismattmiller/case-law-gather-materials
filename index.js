const fs = require('fs')
const H = require('highland')
const glob = require('glob')

const storagePath = '/ftldata/front_matter_expermiment/'
const pageIds = [...Array(11)].map((_, i) => `${('000'+i).slice(-4)}_0.tif`).concat([...Array(11)].map((_, i) => `${('000'+i).slice(-4)}_1.tif`))


// console.log(pageIds)
// process.exit()

// var copyImageFiles = function (data, callback) {

// 	H(data.images)
// 		.

// }


var getAltoFiles = function (data, callback) {
	glob(`${process.env.FROM_VENDOR}${data.barcode}*/alto/*`, {}, function (er, files) {
		var alto = []
		H(files.sort())
			.map((file)=>{
				pageIds.forEach((p)=>{
					if (file.search(p.replace('.tif','.xml'))>-1){
						alto.push(file)
					}
				})
			})
			.done(()=>{
				callback(null,{barcode:data.barcode,images:data.images,alto:alto})
			})
	})
}

var getImageFiles = function (barcode, callback) {
	glob(`${process.env.FROM_VENDOR}${barcode}*/images/*`, {}, function (er, files) {
		var images = []
		H(files.sort())
			.map((file)=>{
				pageIds.forEach((p)=>{
					if (file.search(p)>-1){
						images.push(file)
					}
				})
			})
			.done(()=>{
				callback(null,{barcode:barcode,images:images})
			})
	})
}


// console.log(process.env.FROM_VENDOR)
H(JSON.parse(fs.readFileSync('data/Ill_barcodes.json').toString()))
	.map((barcode)=>{
		console.log(barcode)
		return barcode
	})
  .map(H.curry(getImageFiles))
  .nfcall([])
  .parallel(1)
  .map(H.curry(getAltoFiles))
  .nfcall([])
  .parallel(1)
  .map((data)=>{
  	console.log(data)
  })
	.done(()=>{})