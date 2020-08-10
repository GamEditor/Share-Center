if [[ ! -d "userdata/files" ]]
then
	if [ -L "userdata/files" ]
	then
    	echo "./userdata/files exists"
	else
		mkdir "./userdata/files"
		echo "./userdata/files created"
    fi
fi

npm install --save