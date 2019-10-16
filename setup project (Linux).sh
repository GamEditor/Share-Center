if [[ ! -d "files" ]]
then
	if [ -L "files" ]
	then
    	echo "./files exists"
	else
		mkdir "./files"
		echo "./files created"
    fi
fi
