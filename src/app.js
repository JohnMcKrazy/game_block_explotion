document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('#grid-id');
    const scoreDisplay = document.querySelector('.score');
    const rowsOf3 = document.getElementById('rows_of_3');
    const rowsOf4 = document.getElementById('rows_of_4');
    const rowsOf5 = document.getElementById('rows_of_5');
    const columnsOf3 = document.getElementById('columns_of_3');
    const columnsOf4 = document.getElementById('columns_of_4');
    const columnsOf5 = document.getElementById('columns_of_5');
    const block = 8;
    const squares = [];
    let score = 0;
    ////////////////////////////////////////////////////////
    let countOfRows3 = 0;
    let countOfRows4 = 0;
    let countOfRows5 = 0;
    let countOfColumns3 = 0;
    let countOfColumns4 = 0;
    let countOfColumns5 = 0;
    ///////////////////////////////////////////////////////
    // crear nombre para dulces
    const candyColors = ['red', 'yellow', 'orange', 'purple', 'green', 'blue'];
    //////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////
    //creando el tablero
    ///////////////////////////////////////////////////////
    // funcion que crea tablero
    function createBoard() {
        for (let i = 0; i < block * block; i++) {
            const square = document.createElement('div');
            // para hacerlos jalables con el mouse
            square.setAttribute('draggable', true);

            // ponerles id para saber cual es el que se manipula
            square.setAttribute('id', i);

            // creando random colors
            let randomColors = Math.floor(Math.random() * candyColors.length);
            square.style.backgroundColor = candyColors[randomColors];

            grid.appendChild(square);
            squares.push(square);
            //console.log(squares);
        }
    }
    // se declara la funcion para que se cree !IMPORTANTE
    createBoard();
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //Funcion de arrastre de dulces
    //////////////////////////////////////////////////////////
    //se declaran las variantes de colores que se arrastraran
    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;
    /////////////////////////////////////////////////////
    //se declaran que cada cuadro tendra esas funciones
    /////////////////////////////////////////////////////
    //declara el punto donde comienza el arrastre
    squares.forEach((square) => square.addEventListener('dragstart', dragStart));
    //declara que el arrastre esta permitido por...
    squares.forEach((square) => square.addEventListener('dragend', dragEnd));
    //declara que el arrastre pasa por encima de...
    squares.forEach((square) => square.addEventListener('dragover', dragOver));
    //declara que el arrastre entra por...
    squares.forEach((square) => square.addEventListener('dragenter', dragEnter));
    squares.forEach((square) => square.addEventListener('dragleave', dragLeave));
    //declara el punto donde se suelta el arrastre
    squares.forEach((square) => square.addEventListener('drop', dragDrop));

    //se declaran las funciones de arrastre
    ///////////////////////////////////////
    function dragStart(e) {
        //console.log(this.id, 'dragstart');
        // crea variable que almacena el nombre del color que tomamos al empezar el arrastre
        colorBeingDragged = this.style.backgroundColor;
        //console.log(colorBeingDragged);
        // crea variable que selecciona el id del cuadro que empieza la funcion de arrastre
        squareIdBeingDragged = parseInt(this.id);
        //console.log(squareIdBeingDragged);
    }

    function dragOver(e) {
        //console.log(this.id, 'dragover');
        // esta funcion elimina las caracteristicas de default del arrastre
        e.preventDefault();
    }

    function dragEnter(e) {
        //console.log(this.id, 'dragenter');
        // esta funcion elimina las caracteristicas de default del arrastre
        e.preventDefault();
    }

    function dragLeave() {
        //console.log(this.id, 'dragleave');
    }

    function dragDrop() {
        //console.log(this.id, 'drag');
        // crea variable que remplaza el color que tiene el cuadro a donde se arrastra
        colorBeingReplaced = this.style.backgroundColor;
        //crea variable que selecciona el id del cuadro donde se termina la funcion de arrastre
        squareIdBeingReplaced = parseInt(this.id);
        //console.log(squareIdBeingReplaced);
        // remplaza el color del cuadro donde se deja por el color inicial
        this.style.backgroundColor = colorBeingDragged;
        //crea variable que cambia el color del cuadro donde se deja por el del cuadre donde se empieza
        squares[squareIdBeingDragged].style.backgroundColor = colorBeingReplaced;
    }

    function dragEnd() {
        // console.log(this.id, 'dragend');
        //creacion de los movimientos permitidos
        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - block,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + block,
        ];
        let validMove = validMoves.includes(squareIdBeingReplaced);
        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null;
        } else if (squareIdBeingReplaced && !validMove) {
            squares[squareIdBeingReplaced].style.backgroundColor = colorBeingReplaced;
            squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged;
        } else {
            squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged;
        }
    }
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    //Deja caer esos dulces
    ////////////////////////////////////////////////////////////
    function dropCandy() {
        for (i = 0; i <= 55; i++) {
            if (squares[i + block].style.backgroundColor === '') {
                squares[i + block].style.backgroundColor = squares[i].style.backgroundColor;
                squares[i].style.backgroundColor = '';
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
                const isFirstRow = firstRow.includes(i);
                if (isFirstRow && squares[i].style.backgroundColor === '') {
                    let randomColors = Math.floor(Math.random() * candyColors.length);
                    squares[i].style.backgroundColor = candyColors[randomColors];
                }
            }
        }
    }
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    //funcion de check por coincidencia de 5 en fila
    /////////////////////////////////////////////////////////////
    function checkRowForFive() {
        for (i = 0; i <= 59; i++) {
            let rowOfFive = [i, i + 1, i + 2, i + 3, i + 4];
            let decidedColor = squares[i].style.backgroundColor;

            const isBlank = squares[i].style.backgroundColor === '';

            const notValid = [
                4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31, 36, 37, 38, 39, 44, 45,
                46, 47, 52, 53, 54, 55,
            ];
            if (notValid.includes(i)) continue;
            if (
                rowOfFive.every(
                    (index) => squares[index].style.backgroundColor === decidedColor && !isBlank
                )
            ) {
                score += 5;
                countOfRows5++;
                scoreDisplay.innerHTML = score;
                console.log('Fila de 5 * ' + countOfRows5);

                rowsOf5.innerHTML = countOfRows5;

                rowOfFive.forEach((index) => {
                    squares[index].style.backgroundColor = '';
                });
            }
        }
    }
    checkRowForFive();

    //funcion de check por coincidencia de 5 en columna
    function checkColumnForFive() {
        for (i = 0; i <= 31; i++) {
            let ColumnOfFive = [i, i + block, i + block * 2, i + block * 3, i + block * 4];
            let decidedColor = squares[i].style.backgroundColor;

            const isBlank = squares[i].style.backgroundColor === '';

            if (
                ColumnOfFive.every(
                    (index) => squares[index].style.backgroundColor === decidedColor && !isBlank
                )
            ) {
                score += 5;
                countOfColumns5++;
                scoreDisplay.innerHTML = score;
                console.log('Columna de 5 * ' + countOfColumns5);
                columnsOf5.innerHTML = countOfColumns5;
                ColumnOfFive.forEach((index) => {
                    squares[index].style.backgroundColor = '';
                });
            }
        }
    }
    checkColumnForFive();
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    //funcion de check por coincidencia de 4 en fila
    /////////////////////////////////////////////////////////////
    function checkRowForFour() {
        for (i = 0; i <= 60; i++) {
            let rowOfFour = [i, i + 1, i + 2, i + 3];
            let decidedColor = squares[i].style.backgroundColor;

            const isBlank = squares[i].style.backgroundColor === '';

            const notValid = [
                5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55,
            ];
            if (notValid.includes(i)) continue;
            if (
                rowOfFour.every(
                    (index) => squares[index].style.backgroundColor === decidedColor && !isBlank
                )
            ) {
                score += 4;
                countOfRows4++;
                scoreDisplay.innerHTML = score;
                console.log('Fila de 4 * ' + countOfRows4);
                rowsOf4.innerHTML = countOfRows4;
                rowOfFour.forEach((index) => {
                    squares[index].style.backgroundColor = '';
                });
            }
        }
    }
    checkRowForFour();

    //funcion de check por coincidencia de 4 en columna
    function checkColumnForFour() {
        for (i = 0; i <= 39; i++) {
            let ColumnOfFour = [i, i + block, i + block * 2, i + block * 3];
            let decidedColor = squares[i].style.backgroundColor;

            const isBlank = squares[i].style.backgroundColor === '';

            if (
                ColumnOfFour.every(
                    (index) => squares[index].style.backgroundColor === decidedColor && !isBlank
                )
            ) {
                score += 4;
                countOfColumns4++;
                scoreDisplay.innerHTML = score;
                console.log('Columna de 4 * ' + countOfColumns4);
                columnsOf4.innerHTML = countOfColumns4;
                ColumnOfFour.forEach((index) => {
                    squares[index].style.backgroundColor = '';
                });
            }
        }
    }
    checkColumnForFour();
    ////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    //funcion de check por coincidencia de 3 en fila
    ////////////////////////////////////////////////////////////
    function checkRowForThree() {
        for (i = 0; i <= 61; i++) {
            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = squares[i].style.backgroundColor;

            const isBlank = squares[i].style.backgroundColor === '';

            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
            if (notValid.includes(i)) continue;
            if (
                rowOfThree.every(
                    (index) => squares[index].style.backgroundColor === decidedColor && !isBlank
                )
            ) {
                score += 3;
                countOfRows3++;
                scoreDisplay.innerHTML = score;
                console.log('Fila de 3 * ' + countOfRows3);

                rowsOf3.innerHTML = countOfRows3;
                rowOfThree.forEach((index) => {
                    squares[index].style.backgroundColor = '';
                });
            }
        }
    }
    checkRowForThree();

    //funcion de check por coincidencia de 3 en columna
    function checkColumnForThree() {
        for (i = 0; i <= 47; i++) {
            let ColumnOfThree = [i, i + block, i + block * 2];
            let decidedColor = squares[i].style.backgroundColor;

            const isBlank = squares[i].style.backgroundColor === '';

            if (
                ColumnOfThree.every(
                    (index) => squares[index].style.backgroundColor === decidedColor && !isBlank
                )
            ) {
                score += 3;
                countOfColumns3++;
                scoreDisplay.innerHTML = score;
                console.log('Columna de 3 * ' + countOfColumns3);
                columnsOf3.innerHTML = countOfColumns3;
                ColumnOfThree.forEach((index) => {
                    squares[index].style.backgroundColor = '';
                });
            }
        }
    }
    checkColumnForThree();

    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    // check for win
    /////////////////////////////////////////////////////////////////

    setInterval(checkWin, 100);

    function checkWin() {
        if (score >= 100) {
            console.log(score),
                squares.forEach((square) => square.removeEventListener('dragstart', dragStart)),
                squares.forEach((square) => square.removeEventListener('dragend', dragEnd)),
                squares.forEach((square) => square.removeEventListener('dragover', dragOver)),
                squares.forEach((square) => square.removeEventListener('dragenter', dragEnter)),
                squares.forEach((square) => square.removeEventListener('dragleave', dragLeave)),
                squares.forEach((square) => square.removeEventListener('drop', dragDrop)),
                (scoreDisplay.style.color = 'red'),
                (scoreDisplay.innerHTML = 'YOU WIN!!'),
                stop.checkRowForFive(),
                stop.checkColumnForFive(),
                stop.checkRowForFour(),
                stop.checkColumnForFour(),
                stop.checkRowForThree(),
                stop.checkColumnForThree();
        }
    }

    checkWin();
    ///////////////////////////////////////////////////////////////////

    setInterval(function () {
        dropCandy(), checkWin();
        checkRowForFive(), checkColumnForFive();
    }, 200);
    setInterval(function () {
        checkRowForFour(), checkColumnForFour();
    }, 600);
    setInterval(function () {
        checkRowForThree(), checkColumnForThree();
    }, 1000);
});
