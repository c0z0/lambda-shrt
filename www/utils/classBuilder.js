const classBuilder = (baseClass, optionalClasses) => {
	let finalClass = ''
	let classesObj

	if (typeof baseClass === 'string') {
		finalClass += baseClass
		classesObj = optionalClasses
	} else {
		classesObj = baseClass
	}

	Object.keys(classesObj).forEach(cls => {
		if (classesObj[cls]) finalClass += ' ' + cls
	})

	return finalClass
}

export default classBuilder
