import { Formik, Form } from 'formik';
import { Segment, Button, Header } from 'semantic-ui-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import MyTextInput from '../../../app/common/form/MyTextInput';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Activity } from '../../../app/models/activity';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';
import { v4 as uuid } from 'uuid';
import { useEffect, useState } from 'react';

const validationSchema = Yup.object({
    title: Yup.string().required('The activity title is required'),
    description: Yup.string().required('The activity description is required'),
    category: Yup.string().required('The activity category is required'),
    date: Yup.string().required('Date is required'),
    city: Yup.string().required('The activity city is required'),
    venue: Yup.string().required('The activity venue is required')
});

const ActivityForm = () => {
    const { activityStore } = useStore();
    const { createActivity, editActivity, loading, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: null,
        city: '',
        venue: ''
    });

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!));
    }, [id, loadActivity]);

    function handleFormSubmit(activity: Activity) {
        if (!activity.id) {
            const newActivity = {
                ...activity,
                id: uuid() 
            };
            createActivity(newActivity).then(() => navigate(`/activities/${newActivity.id}`));
        } else {
            editActivity(activity).then(() => navigate(`/activities/${activity.id}`));
        }
    }
    
    if (loadingInitial) return <LoadingComponent content="Loading activity..." />;

    return (
        <Segment clearing>
            <Header content='Activity Details' sub color='teal' />
            <Formik
                validationSchema={validationSchema} 
                enableReinitialize 
                initialValues={activity} 
                onSubmit={(values, _) => handleFormSubmit(values, _)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput placeholder='Title' name='title' label='Title' />
                        <MyTextArea rows={3} placeholder='Description' name='description' label='Description' />
                        <MySelectInput options={categoryOptions} placeholder='Category' name='category' label='Category' />
                        <MyDateInput 
                            customInput={<input className="custom-datepicker-input" />}
                            wrapperClassName="custom-datepicker-wrapper"
                            placeholderText='Date' 
                            name='date' 
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <Header content='Location Details' sub color='teal' />
                        <MyTextInput placeholder='City' name='city' label='City' />
                        <MyTextInput placeholder='Venue' name='venue' label='Venue' />
                        <Button
                            disabled={isSubmitting || !dirty || !isValid} 
                            loading={loading} 
                            floated='right' 
                            positive 
                            type='submit' 
                            content='Submit'/>
                        <Button as={Link} to='/activities' floated='right' type='button' content='Cancel'/>
                    </Form>
                )}
            </Formik>
        </Segment>
    );
};

export default observer(ActivityForm);