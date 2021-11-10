import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { inviteUsers } from '../../services/projects';
import { searchUsers } from '../../services/users';
import { ToastContext } from '../../store';
import { handleError } from '../../utilities/errors';
import { useDebounce } from '../../utilities/hooks';

const InviteProjectMembersDialog = ({ project, dialogOpen, setDialogOpen }) => {
  const { t } = useTranslation();
  const { setError, setSuccess } = useContext(ToastContext);
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (search?.length > 0) {
      searchMembers();
    }
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSearch = ({ query }) => setSearch(query);

  const sendInvites = async (e) => {
    e.preventDefault();
    const users = selectedMembers?.map(({ id }) => id) || [];
    try {
      const { existing_users } = await inviteUsers(project.id, users);
      if (existing_users.length > 0) {
        const str = existing_users.map((eu) => eu.email).join(',');
        setSuccess('Invites', `The invitations were sent! The following users are already in this
          project: ${str}`);
      } else {
        setSuccess('Invites', 'The invitations were sent!');
      }
      setSelectedMembers([]);
      setMembers([]);
      setDialogOpen(false);
    } catch (error) {
      setError(handleError(error));
    }
  };

  const searchMembers = async () => {
    try {
      const { data: foundMembers } = await searchUsers(search);
      setMembers(foundMembers || []);
    } catch (error) {
      setError(handleError(error));
    }
  };

  const itemTemplate = ({ firstname, lastname, identity_provider: idp, email }) => {
    if (idp === 'scribe') {
      return `${firstname} ${lastname} (${email})`;
    }
    return `${firstname} ${lastname} (${idp.toString().toUpperCase()})`;
  };

  return (
    <Dialog
      header={t('INVITE_MEMBERS_TO_PROJECT')}
      visible={dialogOpen}
      style={{ width: '500px' }}
      draggable={false}
      modal
      onHide={() => setDialogOpen(false)}
    >
      <div className="p-fluid">
        <form onSubmit={sendInvites}>
          <div className="p-formgrid p-grid">
            <div className="p-col-12">
              <div className="p-field">
                <label htmlFor="members">{t('SEARCH_MEMBERS_BY_NAME')}</label>
                <AutoComplete
                  value={selectedMembers}
                  suggestions={members}
                  completeMethod={onSearch}
                  itemTemplate={itemTemplate}
                  selectedItemTemplate={itemTemplate}
                  multiple
                  onChange={(e) => setSelectedMembers(e.value)}
                />
              </div>
            </div>
            <div className="p-col-12 p-text-center p-mt-3">
              <div className="p-d-inline-flex p-col-6 p-ai-center p-jc-center">
                <Button
                  label={t('SEND_INVITES')}
                  icon="pi pi-send"
                  type="submit"
                  disabled={selectedMembers?.length === 0}
                  className="p-mr-2 p-mb-2"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default InviteProjectMembersDialog;
