(function() {
    
    window.EZDrag = window.EZDrag || { 
        
        //
        // Drag and drop logic
        //

        // Sits up drag-and-drop logic
        init: () => {

            // TODO: remove / unwire all existing logic

            // TODO: set up drag and drop functions

            let dragItems = document.querySelectorAll('.drag-item');

            if (!dragItems || dragItems.length == 0)
                return;

            tasks.forEach(task => {
                task.addEventListener('dragstart', dragStart);
                task.addEventListener('dragend', dragEnd);
            });

            // DragStart: add 'dragging' class, set data for transfer
            function dragStart(e) {
                draggedTask = this;
                // setTimeout(() => this.classList.add('dragging'), 0);
                e.currentTarget.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.id);
                e.dataTransfer.effectAllowed = 'move';
            }

            // DragEnd: remove 'dragging' class
            function dragEnd() {
                this.classList.remove('dragging');
                draggedTask = null;
            }

        }
    }

})();