cd api-server
call npm i
cd ..\web-server
call npm i
cd ..\gateway-server
call git submodule init
call git submodule update
cd ..\sample-configs\phase-4
call copy-files
cd ..\..\gateway-server
call npm i
cd ..
call node .
