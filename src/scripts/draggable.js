/*

    CSS class: 'drag-container' for container elements (drag targets, basically)
    CSS class 'drag-item' for draggable items

*/

(function() {
    
    window.EZDrag = window.EZDrag || { 
        
        //
        // Drag and drop logic
        //

        // Sits up drag-and-drop logic
        init: () => {

            let draggedItem = null;
            let dragItems = document.querySelectorAll('.drag-item');
            let containers = document.querySelectorAll('.drag-container');

            //
            // Remove / unwire all existing logic
            //

            dragItems.forEach(item => {
                item.removeEventListener('dragstart', dragStart);
                item.removeEventListener('dragend', dragEnd);
            });

            containers.forEach(container => {
                container.removeEventListener('dragover', dragOver);
                container.removeEventListener('dragleave', dragLeave);
                container.removeEventListener('drop', drop);
            });

            //
            // Wire drag and drop logic
            // 

            if (!dragItems || dragItems.length == 0)
                return;

            dragItems.forEach(item => {
                item.addEventListener('dragstart', dragStart);
                item.addEventListener('dragend', dragEnd);
            });

            // DragStart: add 'dragging' class, set data for transfer
            function dragStart(e) {
                draggedItem = this;
                // setTimeout(() => this.classList.add('dragging'), 0);
                e.currentTarget.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.id);
                e.dataTransfer.effectAllowed = 'move';
            }

            // DragEnd: remove 'dragging' class
            function dragEnd() {
                this.classList.remove('dragging');
                draggedItem = null;
            }

            containers.forEach(container => {
                container.addEventListener('dragover', dragOver);
                container.addEventListener('dragleave', dragLeave);
                container.addEventListener('drop', drop);
            });

            // DragOver: determine where the 'dragging' element is hovering; insert it tentatively
            function dragOver(e) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                this.classList.add('drag-over');

                // Find the element to insert the dragged card *after*
                const afterElement = getDragAfterElement(this, e.clientY);
                
                // Perform the insertion
                if (afterElement == null) {
                    // If it returns null, append to the end of the container
                    this.appendChild(draggedItem);
                } else {
                    // Insert before the element found
                    this.insertBefore(draggedItem, afterElement);
                }
            }

            // DragLeave: remove the 'drag-over' class
            function dragLeave(e) {
                this.classList.remove('drag-over');
            }

            // Drop: remove the 'drag-over' class; drop logic was handled in dragOver function
            function drop(e) {
                e.preventDefault();
                this.classList.remove('drag-over');
            }

            // Calculate where the dragging item should land relative to its nearest element
            function getDragAfterElement(container, y) {

                // Get all elements not being dragged
                const draggableElements = [...container.querySelectorAll('.drag-item:not(.dragging)')];

                return draggableElements.reduce((closest, child) => {

                    let box = child.getBoundingClientRect();

                    // Calculate the vertical midpoint of the element
                    let offset = y - box.top - box.height / 2;

                    // Find the element where the mouse is in its top half (negative offset)
                    // and the current offset is closer to 0 than the previous closest element
                    if (offset < 0 && offset > closest.offset) {
                        return { offset: offset, element: child };
                    } else {
                        return closest;
                    }
                }, { offset: Number.NEGATIVE_INFINITY }).element;
            }
        }
    }

})();