// Fonction pour ouvrir le modal de modification
function editTodo(id, title, description, completed) {
    const modal = document.getElementById('editModal');
    const form = document.getElementById('editForm');

    // Définir l'action du formulaire
    form.action = `/todos/${id}/update`;

    // Remplir les champs
    document.getElementById('editTitle').value = title;
    document.getElementById('editDescription').value = description;
    document.getElementById('editCompleted').checked = completed === 1;

    // Afficher le modal
    modal.style.display = 'block';
}

// Fonction pour fermer le modal
function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
}

// Fermer le modal en cliquant en dehors
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Fermer le modal avec la touche Échap
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeEditModal();
    }
});

// Gestion du toggle des tâches en AJAX
document.addEventListener('DOMContentLoaded', function() {
    // Animation au chargement
    const todoItems = document.querySelectorAll('.todo-item');
    todoItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.animation = 'fadeIn 0.5s ease-in';
        }, index * 50);
    });

    // Gestion des checkboxes
    const checkboxes = document.querySelectorAll('.todo-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const todoId = this.getAttribute('data-id');
            const todoItem = this.closest('.todo-item');

            // Désactiver temporairement la checkbox pendant la requête
            this.disabled = true;

            // Envoyer la requête AJAX
            fetch(`/todos/${todoId}/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Basculer la classe 'completed' sur le todo-item
                    todoItem.classList.toggle('completed');

                    // Animation de confirmation
                    todoItem.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        todoItem.style.transform = 'scale(1)';
                    }, 150);

                    // Réactiver la checkbox
                    this.disabled = false;

                    // Mettre à jour les statistiques (optionnel, nécessite rechargement)
                    setTimeout(() => {
                        updateStats();
                    }, 300);
                } else {
                    // En cas d'erreur, restaurer l'état précédent
                    this.checked = !this.checked;
                    this.disabled = false;
                    alert('Erreur lors de la mise à jour de la tâche');
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                // Restaurer l'état en cas d'erreur réseau
                this.checked = !this.checked;
                this.disabled = false;
                alert('Erreur de connexion au serveur');
            });
        });
    });
});

// Fonction pour mettre à jour les statistiques sans recharger la page
function updateStats() {
    fetch('/api/todos')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const todos = data.data;
                const total = todos.length;
                const completed = todos.filter(t => t.completed === 1).length;
                const pending = todos.filter(t => t.completed === 0).length;

                // Mettre à jour l'affichage des stats
                const statsElements = document.querySelectorAll('.stat-item strong');
                if (statsElements.length >= 3) {
                    statsElements[0].textContent = total;
                    statsElements[1].textContent = completed;
                    statsElements[2].textContent = pending;
                }

                // Vérifier si le filtre "terminées" ou "en cours" est actif
                const urlParams = new URLSearchParams(window.location.search);
                const filter = urlParams.get('filter');

                if (filter === 'completed' || filter === 'pending') {
                    // Si un filtre est actif, recharger la page pour mettre à jour la liste
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }
            }
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour des stats:', error);
        });
}

// Confirmation avant suppression de toutes les tâches terminées
const deleteCompletedForm = document.querySelector('form[action="/todos/delete-completed"]');
if (deleteCompletedForm) {
    deleteCompletedForm.addEventListener('submit', function(e) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer toutes les tâches terminées ?')) {
            e.preventDefault();
        }
    });
}

// Animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .todo-item {
        transition: all 0.3s ease;
    }

    .todo-checkbox:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
`;
document.head.appendChild(style);
